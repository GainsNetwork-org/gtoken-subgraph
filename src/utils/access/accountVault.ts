import { BigDecimal, log } from '@graphprotocol/graph-ts';
import { Account, AccountVault, Vault } from '../../types/schema';
import { ZERO_BD } from '../constants';

export function generateAccountVaultId(account: Account, vault: Vault): string {
  return account.id + '-' + vault.id;
}

export function createOrLoadAccountVault(account: Account, vault: Vault, save: boolean): AccountVault {
  log.info('[createOrLoadAccountVault] account {}, vault {}', [account.id, vault.id]);
  const id = generateAccountVaultId(account, vault);
  let accountVault = AccountVault.load(id);
  if (accountVault == null) {
    accountVault = new AccountVault(id);
    accountVault.vault = vault.id;
    accountVault.account = account.id;
    accountVault.sharesBalance = ZERO_BD;
    accountVault.sharesLocked = ZERO_BD;
    accountVault.totalAssetsDeposited = ZERO_BD;
    accountVault.totalAssetsWithdrawn = ZERO_BD;

    if (save) {
      accountVault.save();
    }
  }
  return accountVault as AccountVault;
}
