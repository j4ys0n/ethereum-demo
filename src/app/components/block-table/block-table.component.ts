import * as Web3 from 'web3';

import { Component, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Web3Service } from '../../services/web3/web3.service';
import { SelectedRowService } from '../../services/selected-row/selected-row.service';
import { EthTx, EthBlock, EthUncleRef, BlockResponse } from '../../types/ethereum.types';

@Component({
  selector: 'app-block-table',
  templateUrl: './block-table.component.html',
  styleUrls: ['./block-table.component.scss']
})
export class BlockTableComponent implements AfterViewInit {
  private web3ws: Web3;
  private blockSubscription: any;
  private blocks: Array<EthBlock> = [];
  private blockCacheLimit: number = 10;
  private blockColumns = ['number', 'transactions', 'eth-transferred', 'contracts-created', 'contract-interactions'];
  private blocksDataSource = new MatTableDataSource();
  private selectedRow: any;

  constructor(
    private web3Service: Web3Service,
    private selectedRowService: SelectedRowService
  ) {
    this.web3ws = this.web3Service.web3ws;
  }

  ngAfterViewInit() {
    this.blockSubscription = this.web3ws.eth.subscribe('newBlockHeaders');
    this.blockSubscription.on('data', (result: EthBlock) => {
      this.getBlockFromNode(result.number)
      .then((response: BlockResponse) => {
        this.blocks.push(response.block);
        if (this.blocks.length > this.blockCacheLimit) {
          this.blocks.shift();
        }
        this.blocksDataSource.data = this.blocks;
      })
    });
  }

  private rowClick(row) {
    this.selectedRow = row;
    this.selectedRowService.pushSelect(row);
  }

  private contractsCreated(txes: Array<EthTx>): number {
    return txes.filter((tx: EthTx) => {
      return tx.creates !== null;
    }).length;
  }

  private contractInteractions(txes: Array<EthTx>): number {
    return txes.filter((tx: EthTx) => {
      return tx.input !== '0x' && tx.creates === null;
    }).length;
  }

  private sumValues(txes: Array<EthTx>): number {
    let total = 0;
    txes.forEach((tx: EthTx) => {
      const value = parseFloat(tx.value);
      total += value;
    });
    return total / 10**18;
  }

  private uncleMap(uncles: Array<string>, blockNumber: number): Array<EthUncleRef> {
    return uncles.map(
      (hash: string, index: number): EthUncleRef => {
      return {
        number: blockNumber,
        hash: hash,
        index: index
      }
    });
  }

  private getBlockFromNode(number: number): Promise<BlockResponse> {
    return this.web3ws.eth.getBlock(number, true)
    .then((response: EthBlock) => {
      // check for uncles
      const uncles = this.uncleMap(response.uncles, number);
      return Promise.resolve(<BlockResponse>{
        block: response,
        uncles: uncles
      });
    });
  }

}
