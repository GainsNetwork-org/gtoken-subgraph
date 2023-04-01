import { Bytes, ethereum } from '@graphprotocol/graph-ts';
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
    const contractCreation = ethTransaction.to == null && receipt?.contractAddress;
    transaction = new Transaction(id);
    transaction.logIndex = logIndex;
    transaction.from = ethTransaction.from;
    transaction.gasPrice = ethTransaction.gasPrice;
    transaction.gasLimit = ethTransaction.gasLimit;
    transaction.hash = ethTransaction.hash;
    transaction.index = ethTransaction.index;
    transaction.to = (contractCreation ? receipt.contractAddress : ethTransaction.to || ZERO_ADDRESS) as Bytes;
    transaction.value = ethTransaction.value;
    transaction.timestamp = block.timestamp;
    transaction.blockGasLimit = block.gasLimit;
    transaction.blockNumber = block.number;
    transaction.event = action;
    if (save) {
      transaction.save();
    }
  }
  return transaction as Transaction;
}
