import { BigDecimal } from '@graphprotocol/graph-ts';
import { exponentToBigDecimal } from '.';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const GTOKEN_DECIMALS = 18;
export const GTOKEN_DECIMALS_BD = exponentToBigDecimal(GTOKEN_DECIMALS);
export const ZERO_BD = BigDecimal.fromString('0');
