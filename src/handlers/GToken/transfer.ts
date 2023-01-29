import { log } from '@graphprotocol/graph-ts';
import { Transfer } from '../../types/GToken/GToken';
import { createOrLoadAccount, createOrLoadTransaction } from '../../utils';
import { createOrLoadAccountVault } from '../../utils/access/accountVault';
import { createOrLoadTransfer } from '../../utils/access/transfer';
import { createOrLoadVault, updateVaultForBlock } from '../../utils/access/vault';
import { GTOKEN_DECIMALS, GTOKEN_DECIMALS_BD, ZERO_ADDRESS } from '../../utils/constants';

export function handleTransfer(event: Transfer): void {
  log.info('[handleTransfer] From {}, to {}, amount {}, txHash {}', [
    event.params.from.toHexString(),
    event.params.to.toHexString(),
    event.params.value.toString(),
    event.transaction.hash.toHexString(),
  ]);

  const sharesAmount = event.params.value.toBigDecimal().div(GTOKEN_DECIMALS_BD).truncate(GTOKEN_DECIMALS);
  const transaction = createOrLoadTransaction(event, 'Transfer', true);
  let vault = createOrLoadVault(event.address.toHexString(), false);
  vault = updateVaultForBlock(vault, event.block, true);
  const from = event.params.from.toHexString();
  const fromAccount = createOrLoadAccount(from, true);
  const fromAccountVault = createOrLoadAccountVault(fromAccount, vault, true);
  const to = event.params.to.toHexString();
  const toAccount = createOrLoadAccount(to, true);
  const toAccountVault = createOrLoadAccountVault(toAccount, vault, true);
  const transfer = createOrLoadTransfer(
    {
      from: fromAccount,
      to: toAccount,
      fromAccountVault,
      toAccountVault,
      vault,
      transaction,
      shares: sharesAmount,
    },
    true
  );

  const assetAmountTruncated = transfer.assetValue;

  if (from !== ZERO_ADDRESS) {
    fromAccountVault.totalAssetsWithdrawn = fromAccountVault.totalAssetsWithdrawn.plus(assetAmountTruncated);
    fromAccountVault.sharesBalance.minus(sharesAmount);
  }

  if (to !== ZERO_ADDRESS) {
    toAccountVault.totalAssetsDeposited = toAccountVault.totalAssetsDeposited.plus(assetAmountTruncated);
    toAccountVault.sharesBalance.plus(sharesAmount);
  }

  fromAccountVault.save();
  toAccountVault.save();
}
