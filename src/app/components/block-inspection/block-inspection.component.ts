import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
// eth specific libs, web3 only used for typings here
import * as Web3 from 'web3';
import * as EthUnits from 'ethereumjs-units';
import { Transaction } from 'evm';

import { Web3Service } from '../../services/web3/web3.service';
import { SelectedRowService } from '../../services/selected-row/selected-row.service';
import { EthBlock, EthTx, EthTxReceipt } from '../../types/ethereum.types';

interface ContractInput {
  name: string;
  types: Array<string>;
}

interface EtherscanResponse {
  status: number;
  message: string;
  result: any;
  address?: string;
}

// the keys here will be the contract addresses
interface ContractData {
  [key: string]: {
    symbol?: {
      value?: string;
      requested: boolean;
    };
    decimals?: {
      value?: number;
      requested: boolean;
    };
  }
}

// the keys here will be the transaction hashes
interface TxReceipts {
  [key: string]: {
    requested: boolean;
    receipt?: EthTxReceipt;
  }
}

// this is a generic contract ABI that has all of the methods a normal ERC-20 contract has.
const ABI = [{"constant":true,"inputs":[],"name":"multiAsset","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"commitUpgrade","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getLatestVersion","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_reference","type":"string"},{"name":"_sender","type":"address"}],"name":"_forwardTransferFromWithReference","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"emitApprove","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"emitTransfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"recoverTokens","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"etoken2","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getPendingVersionTimestamp","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"purgeUpgrade","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"optIn","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_reference","type":"string"}],"name":"transferFromWithReference","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_icap","type":"bytes32"},{"name":"_value","type":"uint256"}],"name":"transferToICAP","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_icap","type":"bytes32"},{"name":"_value","type":"uint256"},{"name":"_reference","type":"string"}],"name":"transferToICAPWithReference","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_sender","type":"address"}],"name":"_forwardApprove","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_icap","type":"bytes32"},{"name":"_value","type":"uint256"},{"name":"_reference","type":"string"},{"name":"_sender","type":"address"}],"name":"_forwardTransferFromToICAPWithReference","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_icap","type":"bytes32"},{"name":"_value","type":"uint256"},{"name":"_reference","type":"string"}],"name":"transferFromToICAPWithReference","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_icap","type":"bytes32"},{"name":"_value","type":"uint256"}],"name":"transferFromToICAP","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"etoken2Symbol","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getPendingVersion","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_reference","type":"string"}],"name":"transferWithReference","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_etoken2","type":"address"},{"name":"_symbol","type":"string"},{"name":"_name","type":"string"}],"name":"init","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newVersion","type":"address"}],"name":"proposeUpgrade","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"optOut","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_sender","type":"address"}],"name":"getVersionFor","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newVersion","type":"address"}],"name":"UpgradeProposal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];

@Component({
  selector: 'app-block-inspection',
  templateUrl: './block-inspection.component.html',
  styleUrls: ['./block-inspection.component.scss']
})
export class BlockInspectionComponent implements OnInit {
  private web3ws: Web3;
  private selectedRowSub: Subscription;
  private block: EthBlock;
  private contractData: ContractData = {};
  private txReceipts: TxReceipts = {}; // this will potentially get very big and contain a lot of data.

  constructor(
    private web3Service: Web3Service,
    private selectedRowService: SelectedRowService
  ) {
    this.web3ws = this.web3Service.web3ws;
  }

  ngOnInit() {
    this.selectedRowSub = this.selectedRowService.selectedRowSubject.subscribe((block: EthBlock) => {
      this.block = block;
    });
  }

  private formatTime(time: number): string {
    const dt = new Date(time * 1000);
    // times come in from the blockchain as UTC linux epoch timestamps in seconds.
    // this could be made to work for any timezone if you get the current time and then
    // get the timezone offset and adjust.
    const dtLocal = dt.toLocaleDateString('en-US', {timeZone: 'America/Denver'}) + ' ' + dt.toLocaleTimeString('en-US', {timeZone: 'America/Denver'});
    return dtLocal;
  }

  private formatEth(value: string): number {
    return parseInt(value, 10) / 10**18;
  }

  private gasToEth(gas: number): number {
    return parseFloat(EthUnits.convert(gas * 20, 'gwei', 'eth'));
  }

  private isERC20Transfer(input: string): boolean {
    // 0x === empty
    if (input === '0x') {
      return false
    }
    const functionAndTypes = this.getInputFunctionAndTypes(input);
    return functionAndTypes.name === 'transfer';
  }

  private getInputFunctionAndTypes(input: string): ContractInput {
    const tx = new Transaction();
    tx.setInput(input);
    const fullFunction = tx.getFunction(); // -> transfer(address,uint256)
    // will isolate function name from args transfer(address,uint256) -> ['transfer','address,uint256']
    const nameAndParamsRegex = /(.*)\((.*)\)/;
    let matches: any[] = [];
    if (!!fullFunction) {
      matches = nameAndParamsRegex.exec(fullFunction);
    }

    let contractFunction: ContractInput = {
      name: '',
      types: []
    };
    if (matches.length) {
      contractFunction.name = matches[1];
      if (matches[2] !== '') {
        contractFunction.types = matches[2].split(',')
      }
    }

    return contractFunction;
  }

  private getArguments(input: string): Array<any> {
    const tx = new Transaction();
    tx.setInput(input);
    const args = tx.getArguments();
    return args;
  }

  private formatTokenValue(decimals: number, valueStr: string): number {
    const value = parseInt(valueStr, 10);
    return value / 10**decimals;
  }

  private getSymbolFromNode(contractAddress: string): void {
    // get symbol
    let contract = new this.web3ws.eth.Contract(ABI, contractAddress);
    contract.methods.symbol().call()
    .then(response => {
      if (this.contractData[contractAddress] !== undefined) {
        // combine objects
        this.contractData[contractAddress] = {...this.contractData[contractAddress], ...{symbol: {value: response, requested: true}}};
      } else {
        this.contractData[contractAddress] = {symbol: {value: response, requested: true}};
      }
    });
    if (this.contractData[contractAddress] !== undefined) {
      // combine objects
      this.contractData[contractAddress] = {...this.contractData[contractAddress], ...{symbol: {requested: true}}};
    } else {
      this.contractData[contractAddress] = {symbol: {requested: true}};
    }
  }

  private getSymbol(contractAddress: string): string {
    // caching contract data so we don't have to send a bunch of requests to the node
    // this implementation is a littly hacky but it mostly works.
    if (this.contractData[contractAddress] !== undefined) {
      if (this.contractData[contractAddress].symbol) {
        if (this.contractData[contractAddress].symbol.requested) {
          return this.contractData[contractAddress].symbol.value;
        } else {
          this.getSymbolFromNode(contractAddress);
        }
      } else {
        this.getSymbolFromNode(contractAddress);
      }
    } else {
      this.getSymbolFromNode(contractAddress);
    }
    return '';
  }

  private getDecimalsFromNode(contractAddress: string): void {
    // get decimals
    let contract = new this.web3ws.eth.Contract(ABI, contractAddress);
    contract.methods.decimals().call()
    .then(response => {
      if (this.contractData[contractAddress] !== undefined) {
        // combine objects
        this.contractData[contractAddress] = {...this.contractData[contractAddress], ...{decimals: {value: response, requested: true}}};
      } else {
        this.contractData[contractAddress] = {decimals: {value: response, requested: true}};
      }
    });

    if (this.contractData[contractAddress] !== undefined) {
      // combine objects
      this.contractData[contractAddress] = {...this.contractData[contractAddress], ...{decimals: {requested: true}}};
    } else {
      this.contractData[contractAddress] = {decimals: {requested: true}};
    }
  }

  private getDecimals(contractAddress: string): number {
    // caching contract data so we don't have to send a bunch of requests to the node
    // this implementation is a littly hacky but it mostly works.
    if (this.contractData[contractAddress] !== undefined) {
      if (this.contractData[contractAddress].decimals) {
        if (this.contractData[contractAddress].decimals.requested) {
          return this.contractData[contractAddress].decimals.value;
        } else {
          this.getDecimalsFromNode(contractAddress);
        }
      } else {
        this.getDecimalsFromNode(contractAddress);
      }
    } else {
      this.getDecimalsFromNode(contractAddress);
    }
    return 1;
  }

  private getTxReceiptFromNode(txHash: string): void {
    this.txReceipts[txHash] = {requested: true};
    this.web3ws.eth.getTransactionReceipt(txHash)
    .then((receipt: EthTxReceipt) => {
      this.txReceipts[txHash] = {...this.txReceipts[txHash], ...{receipt}};
    });
  }

  private getTxReceipt(txHash: string): boolean {
    if (this.txReceipts[txHash] !== undefined) {
      if (this.txReceipts[txHash].requested && this.txReceipts[txHash].receipt !== undefined) {
        return this.txReceipts[txHash].receipt.status;
      }
    } else {
      this.getTxReceiptFromNode(txHash);
    }
    return false; // assume unsuccessful unless status is true
  }
}
