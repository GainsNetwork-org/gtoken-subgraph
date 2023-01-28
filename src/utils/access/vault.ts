import { Address, BigDecimal, ethereum } from '@graphprotocol/graph-ts';
import { exponentToBigDecimal } from '..';
import { GToken } from '../../types/GToken/GToken';
import { Vault } from '../../types/schema';

export function createOrLoadVault(id: string, save: boolean): Vault {
  let vault = Vault.load(id);
  if (vault == null) {
    vault = new Vault(id);
    const vaultContract = GToken.bind(Address.fromString(vault.id));
    vault.assetDecimals = vaultContract.decimals();
    if (save) {
      vault.save();
    }
  }
  return vault as Vault;
}

export function updateVaultForBlock(vault: Vault, block: ethereum.Block, save: boolean): Vault {
  // Only update once per block
  if (vault.lastUpdateBlock != null && block.number <= vault.lastUpdateBlock) {
    return vault;
  }

  const vaultContract = GToken.bind(Address.fromString(vault.id));

  vault.epoch = vaultContract.currentEpoch();
  vault.shareToAssetsRaw = vaultContract.shareToAssetsPrice();
  vault.shareToAssets = vault.shareToAssetsRaw.toBigDecimal().div(exponentToBigDecimal(18)).truncate(18);
  vault.lastUpdateBlock = block.number;
  if (save) {
    vault.save();
  }
  return vault;
}
