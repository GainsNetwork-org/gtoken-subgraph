import { BigInt } from '@graphprotocol/graph-ts';
import { Account, Withdraw, Transaction, Vault, AccountVault } from '../../types/schema';

export function generateWithdrawId(account: Account, transaction: Transaction): string {
  return account.id + '-' + transaction.hash.toHexString();
}

export type WithdrawInput = {
  account: Account;
  vault: Vault;
  accountVault: AccountVault;
  assets: BigInt;
  shares: BigInt;
  transaction: Transaction;
};

export function createOrLoadWithdraw(data: WithdrawInput, save: boolean): Withdraw {
  const { account, assets, shares, transaction, vault, accountVault } = data;
  const id = generateWithdrawId(account, transaction);
  let withdraw = Withdraw.load(id);
  if (withdraw == null) {
    withdraw = new Withdraw(id);
    withdraw.account = account.id;
    withdraw.vault = vault.id;
    withdraw.accountVault = accountVault.id;
    withdraw.assets = assets;
    withdraw.shares = shares;
    withdraw.transaction = transaction.id;
    if (save) {
      withdraw.save();
    }
  }
  return withdraw as Withdraw;
}