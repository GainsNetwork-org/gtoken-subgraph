import { Address, BigDecimal, BigInt, ethereum, log } from '@graphprotocol/graph-ts';
import { exponentToBigDecimal } from '..';
import { GToken } from '../../types/GToken/GToken';
import { Vault } from '../../types/schema';
import { ZERO_BD } from '../constants';

export function createOrLoadVault(id: string, save: boolean): Vault {
  log.info('[createOrLoadVault] id {}', [id]);
  let vault = Vault.load(id);
  if (vault == null) {
    vault = new Vault(id);
    log.info('[createOrLoadVault] vault {}', [vault.id]);
    const vaultContract = GToken.bind(Address.fromString(vault.id));
    vault.assetDecimals = vaultContract.decimals();
    vault.shareDecimals = BigInt.fromI32(vaultContract.collateralConfig().getPrecision().toU32());
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
    vault.shareDecimals = BigInt.fromI32(
      GToken.bind(Address.fromString(vault.id)).collateralConfig().getPrecision().toU32()
    );
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
