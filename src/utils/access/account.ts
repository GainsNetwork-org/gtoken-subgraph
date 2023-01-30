import { log } from '@graphprotocol/graph-ts';
import { Account } from '../../types/schema';

export function createOrLoadAccount(id: string, save: boolean): Account {
  log.info('[createOrLoadAccount] id {}', [id]);
  let account = Account.load(id);
  if (account == null) {
    account = new Account(id);
    if (save) {
      account.save();
    }
  }
  return account as Account;
}
