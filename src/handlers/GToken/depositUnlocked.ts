import { log } from '@graphprotocol/graph-ts';
import { DepositUnlocked } from '../../types/GToken/GToken';
import {
  createOrLoadAccount,
  createOrLoadAccountVault,
  createOrLoadTransaction,
  createOrLoadVault,
  createOrLoadDepositUnlocked,
  createOrLoadLockedDeposit,
  updateVaultForBlock,
} from '../../utils';

export function handleDepositUnlocked(event: DepositUnlocked): void {
  const depositId = event.params.depositId.toI32();
  const owner = event.params.owner;

  log.info('[DepositUnlocked] Deposit ID {}, tx hash {}', [depositId.toString(), event.transaction.hash.toHex()]);

  const transaction = createOrLoadTransaction(event, 'DepositUnlocked', true);
  let vault = createOrLoadVault(event.address.toHexString(), false);
  vault = updateVaultForBlock(vault, event.block, true);
  const account = createOrLoadAccount(owner.toHexString(), true);
  const accountVault = createOrLoadAccountVault(account, vault, true);
  const lockedDeposit = createOrLoadLockedDeposit(depositId, true);
  const depositUnlocked = createOrLoadDepositUnlocked(lockedDeposit, transaction, false);
  depositUnlocked.vault = vault.id;
  depositUnlocked.account = account.id;
  depositUnlocked.accountVault = accountVault.id;

  accountVault.sharesBalance = accountVault.sharesBalance.plus(lockedDeposit.shares);
  accountVault.sharesLocked = accountVault.sharesLocked.minus(lockedDeposit.shares);

  lockedDeposit.active = false;

  accountVault.save();
  lockedDeposit.save();
  depositUnlocked.save();
}
