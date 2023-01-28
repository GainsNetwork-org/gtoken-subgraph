import { log } from '@graphprotocol/graph-ts';
import { Deposit } from '../../types/GToken/GToken';
import { createOrLoadAccount, createOrLoadDeposit, createOrLoadTransaction } from '../../utils';

/**
 * Account deposits assets into the vault in exchange for gTokens.
 */
export function handleDeposit(event: Deposit): void {
  const assets = event.params.assets;
  const shares = event.params.shares;
  const recipient = event.params.owner;

  log.info('[handleDeposit] Shares {}, amount {}, receipient {}, txHash {}', [
    event.params.sender.toHexString(),
    shares.toString(),
    recipient.toHexString(),
    event.transaction.hash.toHexString(),
  ]);

  const transaction = createOrLoadTransaction(event, 'Deposit', true);
  const account = createOrLoadAccount(recipient.toHexString(), true);
  const deposit = createOrLoadDeposit({ account, assets, shares, transaction }, true);
}
