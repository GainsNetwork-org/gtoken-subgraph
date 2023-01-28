import { Account } from '../../types/schema';

export function createOrLoadAccount(id: string, save: boolean): Account {
  let account = Account.load(id);
  if (account == null) {
    account = new Account(id);
    if (save) {
      account.save();
    }
  }
  return account as Account;
}
