import { log } from '@graphprotocol/graph-ts';
import { Withdraw } from '../../types/GToken/GToken';
import { createOrLoadAccount, createOrLoadWithdraw, createOrLoadTransaction, exponentToBigDecimal } from '../../utils';
import { createOrLoadAccountVault } from '../../utils/access/accountVault';
import { createOrLoadVault, updateVaultForBlock } from '../../utils/access/vault';

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
  let vault = createOrLoadVault(event.address.toHexString(), false);
  vault = updateVaultForBlock(vault, event.block, true);
  const account = createOrLoadAccount(recipient.toHexString(), true);
  const accountVault = createOrLoadAccountVault(account, vault, true);
  const assetsAmount = assets
    .toBigDecimal()
    .div(exponentToBigDecimal(vault.assetDecimals))
    .truncate(vault.assetDecimals);

  const sharesAmount = shares
    .toBigDecimal()
    .div(exponentToBigDecimal(vault.shareDecimals!.toI32()))
    .truncate(vault.shareDecimals!.toI32());
  const withdraw = createOrLoadWithdraw(
    { account, assets: assetsAmount, shares: sharesAmount, transaction, accountVault, vault },
    true
  );

  accountVault.sharesBalance = accountVault.sharesBalance.minus(withdraw.shares);
  accountVault.totalAssetsWithdrawn = accountVault.totalAssetsWithdrawn.plus(withdraw.assets);
  accountVault.save();
}
