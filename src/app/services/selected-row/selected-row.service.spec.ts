import { TestBed, inject } from '@angular/core/testing';

import { SelectedRowService } from './selected-row.service';

describe('SelectedRowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectedRowService]
    });
  });

  it('should be created', inject([SelectedRowService], (service: SelectedRowService) => {
    expect(service).toBeTruthy();
  }));
});
