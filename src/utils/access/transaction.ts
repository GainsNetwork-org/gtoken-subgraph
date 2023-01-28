import { Bytes, ethereum } from '@graphprotocol/graph-ts';
import { Transaction } from '../../types/schema';

export function generateTransactionId(transactionHash: string, logIndex: string): string {
  return transactionHash + '-' + logIndex;
}

export function createOrLoadTransaction(event: ethereum.Event, action: string, save: boolean): Transaction {
  const { block, transaction: ethTransaction, logIndex } = event;
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
    transaction.to = ethTransaction.to as Bytes;
    transaction.value = ethTransaction.value;
    transaction.timestamp = block.timestamp;
    transaction.blockGasLimit = block.gasLimit;
    transaction.blockNumber = block.number;
    transaction.event = action;
  }
  return transaction as Transaction;
}
