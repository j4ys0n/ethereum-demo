export interface EthTx {
  blockHash: string;
  blockNumber: number;
  chainId: string;
  condition: any;
  creates: string;
  from: string;
  gas: number;
  gasPrice: string;
  hash: string;
  input: string;
  nonce: number;
  publicKey: string;
  r: string;
  raw: string;
  s: string;
  standardV: string;
  to: string;
  transactionIndex: number;
  v: string;
  value: string;
}

export interface EthBlock {
  hash: string;
  author: string;
  difficulty: string;
  extraData: string;
  gasLimit: number;
  gasUsed: number;
  logsBloom: string;
  miner: string;
  mixHash: string;
  nonce: string;
  number: number;
  parentHash: string;
  receiptsRoot: string;
  sealFields: Array<string>;
  sha3Uncles: string;
  size: number;
  stateRoot: string;
  timestamp: number;
  totalDifficulty: string;
  transactionsRoot: string;
  // transactions in uncle blocks aren't valid
  // newBlockHeaders event doesn't return transactions
  transactions?: Array<EthTx>;
  // uncle blocks don't have uncles themselves
  uncles?: Array<string>;
}

export interface EthTxReceiptLog {
  address: string;
  blockHash: string;
  blockNumber: number;
  data: string;
  logIndex: number;
  removed: boolean;
  topics: Array<any>;
  transactionHash: string;
  transactionIndex: number;
  transactionLogIndex: string;
  type: string;
  id: string;
}

export interface EthTxReceipt {
  blockHash: string;
  blockNumber: number;
  contractAddress: string;
  cumulativeGasUsed: number;
  from: string;
  gasUsed: number;
  logs: Array<EthTxReceiptLog>;
  logsBloom: string;
  root: any;
  status: boolean;
  to: string;
  transactionHash: string;
  transactionIndex: number;
}

export interface EthUncleRef {
  number: number;
  hash: string;
  index: number;
}

export interface BlockResponse {
  block: EthBlock;
  uncles: Array<EthUncleRef>;
}
