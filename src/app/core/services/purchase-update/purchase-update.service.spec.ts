import { TestBed } from '@angular/core/testing';

import { PurchaseUpdateService } from './purchase-update.service';

describe('PurchaseUpdateService', () => {
  let service: PurchaseUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
