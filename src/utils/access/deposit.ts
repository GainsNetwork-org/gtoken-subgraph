import { BigInt } from '@graphprotocol/graph-ts';
import { Account, Deposit, Transaction, Vault } from '../../types/schema';

export function generateDepositId(account: Account, transaction: Transaction): string {
  return account.id + '-' + transaction.hash.toHexString();
}

export type DepositInput = {
  account: Account;
  vault: Vault;
  assets: BigInt;
  shares: BigInt;
  transaction: Transaction;
};

export function createOrLoadDeposit(data: DepositInput, save: boolean): Deposit {
  const { account, assets, shares, transaction, vault } = data;
  const id = generateDepositId(account, transaction);
  let deposit = Deposit.load(id);
  if (deposit == null) {
    deposit = new Deposit(id);
    deposit.account = account.id;
    deposit.vault = vault.id;
    deposit.assets = assets;
    deposit.shares = shares;
    deposit.transaction = transaction.id;
    if (save) {
      deposit.save();
    }
  }
  return deposit as Deposit;
}
