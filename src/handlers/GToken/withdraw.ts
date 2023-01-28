import { log } from '@graphprotocol/graph-ts';
import { Withdraw } from '../../types/GToken/GToken';
import { createOrLoadAccount, createOrLoadWithdraw, createOrLoadTransaction } from '../../utils';

/**
 * Account withdraws assets from the vault in exchange for gTokens.
 */
export function handleWithdraw(event: Withdraw): void {
  const assets = event.params.assets;
  const shares = event.params.shares;
  const recipient = event.params.owner;

  log.info('[handleWithdraw] Shares {}, amount {}, receipient {}, txHash {}', [
    event.params.sender.toHexString(),
    shares.toString(),
    recipient.toHexString(),
    event.transaction.hash.toHexString(),
  ]);

  const transaction = createOrLoadTransaction(event, 'Withdraw', true);
  const account = createOrLoadAccount(recipient.toHexString(), true);
  const withdraw = createOrLoadWithdraw({ account, assets, shares, transaction }, true);
}
