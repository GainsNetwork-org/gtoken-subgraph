import { BigDecimal } from '@graphprotocol/graph-ts';
import { exponentToBigDecimal } from '.';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const GTOKEN_DECIMALS = 18;
export const GTOKEN_DECIMALS_BD = exponentToBigDecimal(GTOKEN_DECIMALS);
export const ZERO_BD = BigDecimal.fromString('0');

export const POLYGON = 'matic';
export const MUMBAI = 'mumbai';
export const ARBITRUM = 'arbitrum';

class NetworkAddresses {
  gToken!: string;
  gTokenLockedDepositNft!: string;
}

export const POLYGON_ADDRESSES: NetworkAddresses = {
  gToken: '0x91993f2101cc758D0dEB7279d41e880F7dEFe827',
  gTokenLockedDepositNft: '0xDd42AA3920C1d5b5FD95055d852135416369Bcc1',
};

export const ARBITRUM_ADDRESSES: NetworkAddresses = {
  gToken: '0xd85E038593d7A098614721EaE955EC2022B9B91B',
  gTokenLockedDepositNft: '0x673cf5AB7b44Caac43C80dE5b99A37Ed5B3E4Cc6',
};

export const MUMBAI_ADDRESSES: NetworkAddresses = {
  gToken: '0x5215C8B3e76D493c8bcb9A7352F7afe18A6bb091',
  gTokenLockedDepositNft: '0x5DEcD9E0BE3a720Dea90BADe24658e220514515f',
};
