import { log } from '@graphprotocol/graph-ts';
import { Transfer } from '../../types/GToken/GToken';
import { createOrLoadAccount } from '../../utils';

export function handleTransfer(event: Transfer): void {
  log.info('[handleTransfer] From {}, to {}, amount {}, txHash {}', [
    event.params.from.toHexString(),
    event.params.to.toHexString(),
    event.params.value.toString(),
    event.transaction.hash.toHexString(),
  ]);

  const from = event.params.from.toHexString();
  const accountFrom = createOrLoadAccount(from, true);

  const transaction = createOrLoadTransaction(event, 'Transfer', true);
  const to = event.params.to.toHexString();
  const accountTo = createOrLoadAccount(to, true);

  // create transfer

  // modify accounts balances
}
