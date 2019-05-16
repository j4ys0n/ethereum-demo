import * as Web3 from 'web3';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  public web3ws: Web3;

  constructor() {
    this.web3ws = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
  }
}
