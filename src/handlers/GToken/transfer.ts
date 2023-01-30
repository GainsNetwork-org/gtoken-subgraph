import { log } from '@graphprotocol/graph-ts';
import { Transfer } from '../../types/GToken/GToken';
import { createOrLoadAccount, createOrLoadTransaction } from '../../utils';
import { createOrLoadAccountVault } from '../../utils/access/accountVault';
import { createOrLoadTransfer } from '../../utils/access/transfer';
import { createOrLoadVault, updateVaultForBlock } from '../../utils/access/vault';
import { GTOKEN_DECIMALS, GTOKEN_DECIMALS_BD, ZERO_ADDRESS } from '../../utils/constants';

function shouldProcess(from: string, to: string, contractAddress: string): boolean {
  return from != ZERO_ADDRESS && to != ZERO_ADDRESS && from != contractAddress && to != contractAddress;
}

/**
 * @dev Transfer event handler - only deal with transfers not handle by other contract methods
 */
export function handleTransfer(event: Transfer): void {
  log.info('[handleTransfer] From {}, to {}, amount {}, txHash {}', [
    event.params.from.toHexString(),
    event.params.to.toHexString(),
    event.params.value.toString(),
    event.transaction.hash.toHexString(),
  ]);

  const sharesAmount = event.params.value.toBigDecimal().div(GTOKEN_DECIMALS_BD).truncate(GTOKEN_DECIMALS);
  const transaction = createOrLoadTransaction(event, 'Transfer', true);

  if (!shouldProcess(event.params.from.toHexString(), event.params.to.toHexString(), event.address.toHexString())) {
    log.info('[handleTransfer] Skipping transfer from {} to {}', [
      event.params.from.toHexString(),
      event.params.to.toHexString(),
    ]);
    return;
  }

  let vault = createOrLoadVault(event.address.toHexString(), false);
  vault = updateVaultForBlock(vault, event.block, true);
  const from = event.params.from.toHexString();
  const fromAccount = createOrLoadAccount(from, true);
  const fromAccountVault = createOrLoadAccountVault(fromAccount, vault, true);
  const to = event.params.to.toHexString();
  const toAccount = createOrLoadAccount(to, true);
  const toAccountVault = createOrLoadAccountVault(toAccount, vault, true);
  const transfer = createOrLoadTransfer(fromAccount, toAccount, transaction, false);
  transfer.vault = vault.id;
  transfer.fromAccountVault = fromAccountVault.id;
  transfer.toAccountVault = toAccountVault.id;
  transfer.shares = sharesAmount;
  transfer.assetValue = vault.shareToAssets.times(sharesAmount).truncate(vault.assetDecimals);

  const assetAmountTruncated = transfer.assetValue;

  fromAccountVault.totalAssetsWithdrawn = fromAccountVault.totalAssetsWithdrawn.plus(assetAmountTruncated);
  fromAccountVault.sharesBalance = fromAccountVault.sharesBalance.minus(sharesAmount);
  toAccountVault.totalAssetsDeposited = toAccountVault.totalAssetsDeposited.plus(assetAmountTruncated);
  toAccountVault.sharesBalance = toAccountVault.sharesBalance.plus(sharesAmount);

  transfer.save();
  fromAccountVault.save();
  toAccountVault.save();
}
