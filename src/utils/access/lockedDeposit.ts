import { LockedDeposit, LockedDepositTransaction, Transaction } from '../../types/schema';
import { ZERO_BD } from '../constants';

export function createOrLoadLockedDeposit(depositId: number, save: boolean): LockedDeposit {
  let id = depositId.toString();
  let lockedDeposit = LockedDeposit.load(id);
  if (lockedDeposit == null) {
    lockedDeposit = new LockedDeposit(id);
    lockedDeposit.assetsDeposited = ZERO_BD;
    lockedDeposit.assetsDiscount = ZERO_BD;
    lockedDeposit.discountP = ZERO_BD;
    lockedDeposit.shares = ZERO_BD;
    lockedDeposit.lockDuration = 0;
    lockedDeposit.active = false;
    if (save) {
      lockedDeposit.save();
    }
  }
  return lockedDeposit as LockedDeposit;
}

export function createOrLoadLockedDepositTransaction(
  lockedDeposit: LockedDeposit,
  transaction: Transaction,
  save: boolean
): LockedDepositTransaction {
  const id = lockedDeposit.id + '-' + transaction.id;
  let lockedDepositTransaction = LockedDepositTransaction.load(id);
  if (lockedDepositTransaction == null) {
    lockedDepositTransaction = new LockedDepositTransaction(id);
    lockedDepositTransaction.transaction = transaction.id;
    if (save) {
      lockedDepositTransaction.save();
    }
  }

  return lockedDepositTransaction as LockedDepositTransaction;
}
