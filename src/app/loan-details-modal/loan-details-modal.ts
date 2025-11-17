import { Component, Input } from '@angular/core';
import { LoanObject } from '../types/loan-entry';

@Component({
  selector: 'app-loan-details-modal',
  imports: [],
  template: `
    <div class="modal">
      <h2></h2>
    </div>
  `,
  styleUrl: './loan-details-modal.scss'
})
export class LoanDetailsModal {
  @Input({required: true}) loan!: LoanObject;

  series = [
    {
      name: 'Balance',
      data: this.loan.history?.map(entry => entry.balance) || []
    }
  ]
}
