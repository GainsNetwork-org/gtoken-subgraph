import { Account, AccountVault, Vault } from '../../types/schema';

export function createOrLoadVault(id: string, save: boolean): Vault {
  let vault = Vault.load(id);
  if (vault == null) {
    vault = new Vault(id);
    if (save) {
      vault.save();
    }
  }
  return vault as Vault;
}

export function createOrLoadAccountVault(vault: Vault, account: Account, save: boolean): AccountVault {
  const id = vault.id + '-' + account.id;
  let accountVault = AccountVault.load(id);
  if (accountVault == null) {
    accountVault = new AccountVault(id);
    accountVault.vault = vault.id;
    accountVault.account = account.id;
    if (save) {
      accountVault.save();
    }
  }
  return accountVault as AccountVault;
}
