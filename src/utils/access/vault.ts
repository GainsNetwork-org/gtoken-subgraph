import { ethereum } from '@graphprotocol/graph-ts';
import { Vault } from '../../types/schema';

export function createOrLoadVault(id: string, save: boolean): Vault {
  let vault = Vault.load(id);
  if (vault == null) {
    vault = new Vault(id);
    if (save) {
      vault.save();
    }
  }
  return vault as Vault;
}

export function updateVaultForBlock(vault: Vault, block: ethereum.Block, save: boolean): void {
  // Only update once per block
  if (vault.lastUpdateBlock != null && block.number <= vault.lastUpdateBlock) {
    return;
  }

  // TODO NEXT: Update exchangeRate

  if (save) {
    vault.save();
  }
}
