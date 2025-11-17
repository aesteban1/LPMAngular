import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDetailsModal } from './loan-details-modal';

describe('LoanDetailsModal', () => {
  let component: LoanDetailsModal;
  let fixture: ComponentFixture<LoanDetailsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDetailsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanDetailsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
