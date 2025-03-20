import { Address, BigDecimal, BigInt, ethereum, log } from '@graphprotocol/graph-ts';
import { exponentToBigDecimal } from '..';
import { GToken } from '../../types/GToken/GToken';
import { Vault } from '../../types/schema';
import { GTOKEN_DECIMALS, ZERO_BD } from '../constants';

export function createOrLoadVault(id: string, save: boolean): Vault {
  log.info('[createOrLoadVault] id {}', [id]);
  let vault = Vault.load(id);
  if (vault == null) {
    vault = new Vault(id);
    log.info('[createOrLoadVault] vault {}', [vault.id]);
    const vaultContract = GToken.bind(Address.fromString(vault.id));
    vault.assetDecimals = vaultContract.decimals();

    // Try to read collateralconfig, fall back to constant if not available
    const tryResponse = vaultContract.try_collateralConfig();
    if (!tryResponse.reverted) {
      vault.shareDecimals = BigInt.fromI64(tryResponse.value.getPrecision().toU64().toString().length - 1);
    } else {
      vault.shareDecimals = BigInt.fromI64(GTOKEN_DECIMALS);
    }

    vault.lastUpdateBlock = 0;
    vault.lastUpdateTimestamp = 0;
    vault.epoch = 0;
    vault.shareToAssets = ZERO_BD;

    if (save) {
      vault.save();
    }
  }
  // Handle the case where the vault entity was created before the decimals were set
  else if (vault.shareDecimals === null || vault.shareDecimals!.toI32() == 0) {
    // Try to read collateralconfig
    // If error, default to what's in constants - DAI vault for example was never updated with collateralconfig
    const tryResponse = GToken.bind(Address.fromString(vault.id)).try_collateralConfig();
    if (!tryResponse.reverted) {
      vault.shareDecimals = BigInt.fromI64(tryResponse.value.getPrecision().toU64().toString().length - 1);
    } else {
      vault.shareDecimals = BigInt.fromI64(GTOKEN_DECIMALS);
    }

    if (save) {
      vault.save();
    }
  }
  return vault as Vault;
}

export function updateVaultForBlock(vault: Vault, block: ethereum.Block, save: boolean): Vault {
  log.info('[updateVaultForBlock] vault {}, block {}', [vault.id, block.number.toString()]);

  // Only update once per block
  if (block.number.toI32() <= vault.lastUpdateBlock) {
    return vault;
  }

  const vaultContract = GToken.bind(Address.fromString(vault.id));

  vault.epoch = vaultContract.currentEpoch().toI32();
  vault.shareToAssets = vaultContract.shareToAssetsPrice().toBigDecimal().div(exponentToBigDecimal(18)).truncate(18);
  vault.lastUpdateBlock = block.number.toI32();
  vault.lastUpdateTimestamp = block.timestamp.toI32();
  if (save) {
    vault.save();
  }
  return vault;
}
