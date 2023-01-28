import { Account, AccountVault, Vault } from '../../types/schema';

export function generateAccountVaultId(account: Account, vault: Vault): string {
  return account.id + '-' + vault.id;
}

export function createOrLoadAccountVault(account: Account, vault: Vault, save: boolean): AccountVault {
  const id = generateAccountVaultId(account, vault);
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
