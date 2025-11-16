import { TestBed } from '@angular/core/testing';

import { LoanUiService } from './loan-ui-service';

describe('LoanUiService', () => {
  let service: LoanUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
