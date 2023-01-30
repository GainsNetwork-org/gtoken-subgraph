import { BigInt } from '@graphprotocol/graph-ts';
import { exponentToBigDecimal } from '..';
import { Account, AccountVault, Deposit, Transaction, Vault } from '../../types/schema';
import { GTOKEN_DECIMALS, GTOKEN_DECIMALS_BD } from '../constants';

export function generateDepositId(account: Account, transaction: Transaction): string {
  return account.id + '-' + transaction.hash.toHexString();
}

export class DepositInput {
  account!: Account;
  vault!: Vault;
  accountVault!: AccountVault;
  assets!: BigInt;
  shares!: BigInt;
  transaction!: Transaction;
}

export function createOrLoadDeposit(data: DepositInput, save: boolean): Deposit {
  const account = data.account;
  const assets = data.assets;
  const shares = data.shares;
  const transaction = data.transaction;
  const vault = data.vault;
  const accountVault = data.accountVault;
  const id = generateDepositId(account, transaction);
  let deposit = Deposit.load(id);
  if (deposit == null) {
    deposit = new Deposit(id);
    deposit.account = account.id;
    deposit.vault = vault.id;
    deposit.accountVault = accountVault.id;
    deposit.assets = assets.toBigDecimal().div(exponentToBigDecimal(vault.assetDecimals)).truncate(vault.assetDecimals);
    deposit.shares = shares.toBigDecimal().div(GTOKEN_DECIMALS_BD).truncate(GTOKEN_DECIMALS);
    deposit.transaction = transaction.id;
    if (save) {
      deposit.save();
    }
  }
  return deposit as Deposit;
}
