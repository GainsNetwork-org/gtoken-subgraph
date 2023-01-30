import { BigDecimal, BigInt, dataSource, log } from '@graphprotocol/graph-ts';
import { POLYGON, MUMBAI, ARBITRUM, POLYGON_ADDRESSES, MUMBAI_ADDRESSES, ARBITRUM_ADDRESSES } from './constants';

export function exponentToBigDecimal(decimals: i32): BigDecimal {
  let bd = BigDecimal.fromString('1');
  for (let i = 0; i < decimals; i++) {
    bd = bd.times(BigDecimal.fromString('10'));
  }
  return bd;
}

export function toDecimal(value: BigInt, decimals: i32): BigDecimal {
  return value.toBigDecimal().div(exponentToBigDecimal(decimals).truncate(decimals));
}

export function getVaultAddress(): string {
  log.info('getVaultAddress: network {}', [dataSource.network()]);
  if (dataSource.network() == POLYGON) {
    return POLYGON_ADDRESSES.gToken;
  }
  if (dataSource.network() == MUMBAI) {
    return MUMBAI_ADDRESSES.gToken;
  }
  if (dataSource.network() == ARBITRUM) {
    return ARBITRUM_ADDRESSES.gToken;
  }
  return '';
}

export function getNftAddress(): string {
  log.info('getNftAddress: network {}', [dataSource.network()]);
  if (dataSource.network() == POLYGON) {
    return POLYGON_ADDRESSES.gTokenLockedDepositNft;
  }
  if (dataSource.network() == MUMBAI) {
    return MUMBAI_ADDRESSES.gTokenLockedDepositNft;
  }
  if (dataSource.network() == ARBITRUM) {
    return ARBITRUM_ADDRESSES.gTokenLockedDepositNft;
  }
  return '';
}

export * from './access';
