import { Bytes, ethereum, Address } from '@graphprotocol/graph-ts';
import { Transaction } from '../../types/schema';
import { ZERO_ADDRESS } from '../constants';

export function generateTransactionId(transactionHash: string, logIndex: string): string {
  return transactionHash + '-' + logIndex;
}

export function createOrLoadTransaction(event: ethereum.Event, action: string, save: boolean): Transaction {
  const block = event.block;
  const ethTransaction = event.transaction;
  const logIndex = event.logIndex;
  const receipt = event.receipt;

  const id = generateTransactionId(ethTransaction.hash.toHexString(), logIndex.toString());
  let transaction = Transaction.load(id);
  if (transaction == null) {
    transaction = new Transaction(id);
    transaction.logIndex = logIndex;
    transaction.from = ethTransaction.from;
    transaction.gasPrice = ethTransaction.gasPrice;
    transaction.gasLimit = ethTransaction.gasLimit;
    transaction.hash = ethTransaction.hash;
    transaction.index = ethTransaction.index;
    transaction.value = ethTransaction.value;
    transaction.timestamp = block.timestamp;
    transaction.blockGasLimit = block.gasLimit;
    transaction.blockNumber = block.number;
    transaction.event = action;

    let to = ethTransaction.to;
    if (to === null) {
      to = Address.fromString(ZERO_ADDRESS);
      if (receipt != null && receipt.contractAddress !== null) {
        to = receipt.contractAddress;
      }
    }
    transaction.to = to as Bytes;

    if (save) {
      transaction.save();
    }
  }
  return transaction as Transaction;
}
