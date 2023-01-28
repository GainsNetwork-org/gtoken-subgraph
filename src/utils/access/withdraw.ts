import { BigInt } from '@graphprotocol/graph-ts';
import { Account, Withdraw, Transaction, Vault } from '../../types/schema';

export function generateWithdrawId(account: Account, transaction: Transaction): string {
  return account.id + '-' + transaction.hash.toHexString();
}

export type WithdrawInput = {
  account: Account;
  vault: Vault;
  assets: BigInt;
  shares: BigInt;
  transaction: Transaction;
};

export function createOrLoadWithdraw(data: WithdrawInput, save: boolean): Withdraw {
  const { account, assets, shares, transaction, vault } = data;
  const id = generateWithdrawId(account, transaction);
  let withdraw = Withdraw.load(id);
  if (withdraw == null) {
    withdraw = new Withdraw(id);
    withdraw.account = account.id;
    withdraw.vault = vault.id;
    withdraw.assets = assets;
    withdraw.shares = shares;
    withdraw.transaction = transaction.id;
    if (save) {
      withdraw.save();
    }
  }
  return withdraw as Withdraw;
}
