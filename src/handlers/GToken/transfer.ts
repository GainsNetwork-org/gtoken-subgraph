import { log } from '@graphprotocol/graph-ts';
import { Transfer } from '../../types/GToken/GToken';
import { createOrLoadAccount, createOrLoadTransaction } from '../../utils';
import { createOrLoadAccountVault } from '../../utils/access/accountVault';
import { createOrLoadTransfer } from '../../utils/access/transfer';
import { createOrLoadVault } from '../../utils/access/vault';

export function handleTransfer(event: Transfer): void {
  log.info('[handleTransfer] From {}, to {}, amount {}, txHash {}', [
    event.params.from.toHexString(),
    event.params.to.toHexString(),
    event.params.value.toString(),
    event.transaction.hash.toHexString(),
  ]);

  const shares = event.params.value;
  const transaction = createOrLoadTransaction(event, 'Transfer', true);
  const vault = createOrLoadVault(event.address.toHexString(), true);
  const fromAccount = createOrLoadAccount(event.params.from.toHexString(), true);
  const fromAccountVault = createOrLoadAccountVault(fromAccount, vault, true);
  const toAccount = createOrLoadAccount(event.params.to.toHexString(), true);
  const toAccountVault = createOrLoadAccountVault(toAccount, vault, true);
  const transfer = createOrLoadTransfer(
    {
      from: fromAccount,
      to: toAccount,
      fromAccountVault,
      toAccountVault,
      vault,
      transaction,
      shares,
    },
    true
  );
}
