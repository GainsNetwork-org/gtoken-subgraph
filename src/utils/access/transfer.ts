import { Account, Transaction, Transfer } from '../../types/schema';

export function generateTransferId(from: Account, to: Account, transaction: Transaction): string {
  return from.id + '-' + to.id + '-' + transaction.id;
}

export function createOrLoadTransfer(from: Account, to: Account, transaction: Transaction, save: boolean): Transfer {
  const id = generateTransferId(from, to, transaction);
  let transfer = Transfer.load(id);
  if (transfer == null) {
    transfer = new Transfer(id);
    transfer.from = from.id;
    transfer.to = to.id;
    transfer.transaction = transaction.id;
    if (save) {
      transfer.save();
    }
  }
  return transfer as Transfer;
}
