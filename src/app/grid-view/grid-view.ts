import { Component, EventEmitter, Input, Output } from '@angular/core';
import { type LoanObject } from '../types/loan-entry';
import { Gridcard } from '../gridcard/gridcard';

@Component({
  selector: 'app-grid-item',
  imports: [Gridcard],
  template: `
  <div class="grid-display" aria-label="display-table">
    @for (loan of loanObjectList; track loan.id) {
      <app-gridcard 
        [loanObject]="loan"
        [selectMode]="selectMode"
        [selected]="selectedIds.has(loan.id)"
        (toggleSelection)="toggleSelection.emit($event)"
        (deleteLoanItem)="this.deleteLoanItem.emit($event)">
      </app-gridcard>
    }
    </div>
  `,
  styleUrl: './grid-view.scss'
})
export class GridItem {
  @Input() loanObjectList!: LoanObject[];
  @Input() selectMode = false;
  @Input() selectedIds = new Set();

  @Output() toggleSelection = new EventEmitter<number>();
  @Output() deleteLoanItem = new EventEmitter<number>();
}
