import { log } from '@graphprotocol/graph-ts';
import { LockedDeposit, LockedDepositTransaction, Transaction } from '../../types/schema';
import { ZERO_BD } from '../constants';

export function createOrLoadLockedDeposit(depositId: number, save: boolean): LockedDeposit {
  log.info('[createOrLoadLockedDeposit] depositId {}', [depositId.toString()]);
  let id = depositId.toString();
  let lockedDeposit = LockedDeposit.load(id);
  log.info('[createOrLoadLockedDeposit] lockedDeposit {}', [lockedDeposit ? 'exists' : 'null']);
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
  log.info('[createOrLoadLockedDepositTransaction] lockedDeposit {}, txHash {}', [
    lockedDeposit.id,
    transaction.hash.toHexString(),
  ]);
  const id = lockedDeposit.id + '-' + transaction.id;
  let lockedDepositTransaction = LockedDepositTransaction.load(id);
  if (lockedDepositTransaction == null) {
    lockedDepositTransaction = new LockedDepositTransaction(id);
    lockedDepositTransaction.transaction = transaction.id;
    lockedDepositTransaction.lockedDeposit = lockedDeposit.id;
    if (save) {
      lockedDepositTransaction.save();
    }
  }

  return lockedDepositTransaction as LockedDepositTransaction;
}
