import { log } from '@graphprotocol/graph-ts';
import { Withdraw } from '../../types/GToken/GToken';
import { createOrLoadAccount, createOrLoadWithdraw, createOrLoadTransaction, exponentToBigDecimal } from '../../utils';
import { createOrLoadAccountVault } from '../../utils/access/accountVault';
import { createOrLoadVault } from '../../utils/access/vault';
import { GTOKEN_DECIMALS, GTOKEN_DECIMALS_BD } from '../../utils/constants';

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
  const vault = createOrLoadVault(event.address.toHexString(), true);
  const account = createOrLoadAccount(recipient.toHexString(), true);
  const accountVault = createOrLoadAccountVault(account, vault, true);
  const assetsAmount = assets
    .toBigDecimal()
    .div(exponentToBigDecimal(vault.assetDecimals))
    .truncate(vault.assetDecimals);

  const sharesAmount = shares.toBigDecimal().div(GTOKEN_DECIMALS_BD).truncate(GTOKEN_DECIMALS);
  createOrLoadWithdraw({ account, assets: assetsAmount, shares: sharesAmount, transaction, accountVault, vault }, true);
}
