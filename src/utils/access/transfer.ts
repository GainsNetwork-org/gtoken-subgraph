import { BigInt } from '@graphprotocol/graph-ts';
import { Account, Transaction, Transfer, Vault } from '../../types/schema';

export function generateTransferId(from: Account, to: Account, transaction: Transaction): string {
  return from.id + '-' + to.id + '-' + transaction.id;
}

export type TransferInput = {
  from: Account;
  to: Account;
  vault: Vault;
  shares: BigInt;
  transaction: Transaction;
};

export function createOrLoadTransfer(data: TransferInput, save: boolean): Transfer {
  const { from, to, shares, transaction, vault } = data;
  const id = generateTransferId(from, to, transaction);
  let transfer = Transfer.load(id);
  if (transfer == null) {
    transfer = new Transfer(id);
    transfer.from = from.id;
    transfer.to = to.id;
    transfer.vault = vault.id;
    transfer.shares = shares;
    transfer.shares = shares;
    transfer.transaction = transaction.id;
    if (save) {
      transfer.save();
    }
  }
  return transfer as Transfer;
}
