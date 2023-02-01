import { BigDecimal, log } from '@graphprotocol/graph-ts';
import { DepositLocked } from '../../types/GToken/GToken';
import { createOrLoadAccount, createOrLoadTransaction, toDecimal } from '../../utils';
import { createOrLoadVault, updateVaultForBlock } from '../../utils/access/vault';
import { createOrLoadAccountVault } from '../../utils/access/accountVault';
import { createOrLoadLockedDeposit, createOrLoadLockedDepositTransaction } from '../../utils/access/lockedDeposit';
import { GTOKEN_DECIMALS } from '../../utils/constants';

export function handleDepositLocked(event: DepositLocked): void {
  const depositId = event.params.depositId;
  const recipient = event.params.owner;
  const lockedDepositEvent = event.params.d;

  log.info('[handleLockedDeposit] Deposit ID {}, txHash {}', [
    depositId.toString(),
    event.transaction.hash.toHexString(),
  ]);

  const transaction = createOrLoadTransaction(event, 'LockedDeposit', true);
  let vault = createOrLoadVault(event.address.toHexString(), false);
  vault = updateVaultForBlock(vault, event.block, true);
  const account = createOrLoadAccount(recipient.toHexString(), true);
  const accountVault = createOrLoadAccountVault(account, vault, true);
  const lockedDeposit = createOrLoadLockedDeposit(depositId.toI32(), false);
  lockedDeposit.account = account.id;
  lockedDeposit.vault = vault.id;
  lockedDeposit.accountVault = accountVault.id;
  lockedDeposit.assetsDeposited = toDecimal(lockedDepositEvent.assetsDeposited, vault.assetDecimals);
  lockedDeposit.assetsDiscount = toDecimal(lockedDepositEvent.assetsDiscount, vault.assetDecimals);
  lockedDeposit.discountP = lockedDeposit.assetsDiscount
    .div(lockedDeposit.assetsDeposited)
    .times(BigDecimal.fromString('100'));
  lockedDeposit.shares = toDecimal(lockedDepositEvent.shares, GTOKEN_DECIMALS);
  lockedDeposit.lockDuration = lockedDepositEvent.lockDuration.toI32();
  lockedDeposit.active = true;

  const lockedDepositTransaction = createOrLoadLockedDepositTransaction(lockedDeposit, transaction, false);
  lockedDepositTransaction.vault = vault.id;
  lockedDepositTransaction.account = account.id;
  lockedDepositTransaction.accountVault = accountVault.id;

  accountVault.totalAssetsDeposited = accountVault.totalAssetsDeposited.plus(lockedDeposit.assetsDeposited);
  accountVault.sharesLocked = accountVault.sharesLocked.plus(lockedDeposit.shares);

  lockedDepositTransaction.save();
  accountVault.save();
  lockedDeposit.save();
}
