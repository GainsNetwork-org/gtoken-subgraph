import { DepositUnlocked, LockedDeposit, Transaction } from '../../types/schema';

export function createOrLoadDepositUnlocked(
  lockedDeposit: LockedDeposit,
  transaction: Transaction,
  save: boolean
): DepositUnlocked {
  const id = lockedDeposit.id + '-' + transaction.id;
  let depositUnlocked = DepositUnlocked.load(id);
  if (depositUnlocked == null) {
    depositUnlocked = new DepositUnlocked(id);
    depositUnlocked.transaction = transaction.id;
    depositUnlocked.lockedDeposit = lockedDeposit.id;
    if (save) {
      depositUnlocked.save();
    }
  }

  return depositUnlocked as DepositUnlocked;
}
