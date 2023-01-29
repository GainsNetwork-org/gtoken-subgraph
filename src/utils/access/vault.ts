import { Address, BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { exponentToBigDecimal } from '..';
import { GToken } from '../../types/GToken/GToken';
import { Vault } from '../../types/schema';
import { ZERO_BD } from '../constants';

export function createOrLoadVault(id: string, save: boolean): Vault {
  let vault = Vault.load(id);
  if (vault == null) {
    vault = new Vault(id);
    const vaultContract = GToken.bind(Address.fromString(vault.id));
    vault.assetDecimals = vaultContract.decimals();
    vault.lastUpdateBlock = 0;
    vault.lastUpdateTimestamp = 0;
    vault.epoch = BigInt.fromI32(0);
    vault.shareToAssetsRaw = BigInt.fromI32(0);
    vault.shareToAssets = ZERO_BD;

    if (save) {
      vault.save();
    }
  }
  return vault as Vault;
}

export function updateVaultForBlock(vault: Vault, block: ethereum.Block, save: boolean): Vault {
  // Only update once per block
  if (block.number.toI32() <= vault.lastUpdateBlock) {
    return vault;
  }

  const vaultContract = GToken.bind(Address.fromString(vault.id));

  vault.epoch = vaultContract.currentEpoch();
  vault.shareToAssetsRaw = vaultContract.shareToAssetsPrice();
  vault.shareToAssets = vault.shareToAssetsRaw.toBigDecimal().div(exponentToBigDecimal(18)).truncate(18);
  vault.lastUpdateBlock = block.number.toI32();
  vault.lastUpdateTimestamp = block.timestamp.toI32();
  if (save) {
    vault.save();
  }
  return vault;
}
