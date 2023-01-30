import { Account, Transaction, LockedDepositTransfer } from '../../types/schema';

export function generateLockedDepositTransferId(from: Account, to: Account, transaction: Transaction): string {
  return from.id + '-' + to.id + '-' + transaction.id;
}

export function createOrLoadLockedDepositTransfer(
  from: Account,
  to: Account,
  transaction: Transaction,
  save: boolean
): LockedDepositTransfer {
  const id = generateLockedDepositTransferId(from, to, transaction);
  let transfer = LockedDepositTransfer.load(id);
  if (transfer == null) {
    transfer = new LockedDepositTransfer(id);
    transfer.from = from.id;
    transfer.to = to.id;
    transfer.transaction = transaction.id;
    if (save) {
      transfer.save();
    }
  }
  return transfer as LockedDepositTransfer;
}
