import { log } from '@graphprotocol/graph-ts';
import { Transfer } from '../../types/GToken/GTokenLockedDepositNft';
import { createOrLoadAccount, createOrLoadTransaction, getVaultAddress } from '../../utils';
import { createOrLoadAccountVault } from '../../utils/access/accountVault';
import { createOrLoadLockedDeposit } from '../../utils/access/lockedDeposit';
import { createOrLoadLockedDepositTransfer } from '../../utils/access/lockedDepositTransfer';
import { createOrLoadVault, updateVaultForBlock } from '../../utils/access/vault';
import { ZERO_ADDRESS } from '../../utils/constants';

export function handleTransfer(event: Transfer): void {
  log.info('[handleTransferNft] From {}, to {}, txHash {}', [
    event.params.from.toHexString(),
    event.params.to.toHexString(),
    event.transaction.hash.toHexString(),
  ]);

  const transaction = createOrLoadTransaction(event, 'LockedDepositTransfer', true);
  let vault = createOrLoadVault(getVaultAddress(), false);
  vault = updateVaultForBlock(vault, event.block, true);
  const from = event.params.from.toHexString();
  const fromAccount = createOrLoadAccount(from, true);
  const fromAccountVault = createOrLoadAccountVault(fromAccount, vault, true);
  const to = event.params.to.toHexString();
  const toAccount = createOrLoadAccount(to, true);
  const toAccountVault = createOrLoadAccountVault(toAccount, vault, true);
  const lockedDeposit = createOrLoadLockedDeposit(event.params.tokenId.toI32(), false);
  const transfer = createOrLoadLockedDepositTransfer(fromAccount, toAccount, transaction, false);
  transfer.vault = vault.id;
  transfer.fromAccountVault = fromAccountVault.id;
  transfer.toAccountVault = toAccountVault.id;
  transfer.lockedDeposit = lockedDeposit.id;

  // Deduct from fromAccountVault
  // Use market rate
  const assetValue = vault.shareToAssets
    .times(lockedDeposit.assetsDeposited.plus(lockedDeposit.assetsDiscount))
    .truncate(vault.assetDecimals);
  if (from !== ZERO_ADDRESS && from !== event.address.toHexString()) {
    fromAccountVault.totalAssetsWithdrawn = fromAccountVault.totalAssetsWithdrawn.plus(assetValue);
    fromAccountVault.sharesLocked.minus(lockedDeposit.shares);
  }

  if (to !== ZERO_ADDRESS) {
    toAccountVault.totalAssetsDeposited = toAccountVault.totalAssetsDeposited.plus(assetValue);
    toAccountVault.sharesLocked.plus(lockedDeposit.shares);
  }

  lockedDeposit.save();
  transfer.save();
  fromAccountVault.save();
  toAccountVault.save();
}
