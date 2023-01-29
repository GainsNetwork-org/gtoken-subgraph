import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { Account, AccountVault, Transaction, Transfer, Vault } from '../../types/schema';

export function generateTransferId(from: Account, to: Account, transaction: Transaction): string {
  return from.id + '-' + to.id + '-' + transaction.id;
}

export class TransferInput {
  from!: Account;
  fromAccountVault!: AccountVault;
  to!: Account;
  toAccountVault!: AccountVault;
  vault!: Vault;
  shares!: BigDecimal;
  transaction!: Transaction;
}

export function createOrLoadTransfer(data: TransferInput, save: boolean): Transfer {
  const from = data.from;
  const to = data.to;
  const shares = data.shares;
  const transaction = data.transaction;
  const vault = data.vault;
  const fromAccountVault = data.fromAccountVault;
  const toAccountVault = data.toAccountVault;

  const id = generateTransferId(from, to, transaction);
  let transfer = Transfer.load(id);
  if (transfer == null) {
    transfer = new Transfer(id);
    transfer.from = from.id;
    transfer.fromAccountVault = fromAccountVault.id;
    transfer.to = to.id;
    transfer.toAccountVault = toAccountVault.id;
    transfer.vault = vault.id;
    transfer.shares = shares;
    transfer.assetValue = vault.shareToAssets.times(shares).truncate(vault.assetDecimals);
    transfer.transaction = transaction.id;
    if (save) {
      transfer.save();
    }
  }
  return transfer as Transfer;
}
