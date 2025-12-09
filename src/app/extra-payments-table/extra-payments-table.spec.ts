import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraPaymentsTable } from './extra-payments-table';

describe('ExtraPaymentsTable', () => {
  let component: ExtraPaymentsTable;
  let fixture: ComponentFixture<ExtraPaymentsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtraPaymentsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraPaymentsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
