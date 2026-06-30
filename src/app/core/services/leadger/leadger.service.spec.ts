import { TestBed } from '@angular/core/testing';

import { LeadgerService } from './leadger.service';

describe('LeadgerService', () => {
  let service: LeadgerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadgerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
