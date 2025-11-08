import { TestBed } from '@angular/core/testing';

import { Dropdownservice } from './dropdownservice';

describe('Dropdownservice', () => {
  let service: Dropdownservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dropdownservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
