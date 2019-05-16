import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { EthBlock} from '../../types/ethereum.types';

@Injectable({
  providedIn: 'root'
})
export class SelectedRowService {

  public selectedRowSubject: Subject<EthBlock> = new Subject<EthBlock>();

  constructor() { }

  pushSelect(row: EthBlock): void {
    this.selectedRowSubject.next(row);
  }
}
