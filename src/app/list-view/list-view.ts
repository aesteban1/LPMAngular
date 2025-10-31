import { Component, Input, Output, EventEmitter} from '@angular/core';
import { type LoanObject } from '../types/loan-entry';

@Component({
  selector: 'app-list-item',
  imports: [],
  template: `
    <table [class.selectMode]="selectMode">
      <thead>
        <th>Name</th>
        <th>Balance</th>
        <th>Rate</th>
        <th>Minimum</th>
        <th>Pay Order</th>
        <th>Last Payment</th>
      </thead>
      <tbody>
        @for (loan of loanObjectList; track loan.id) {
          <tr
          [class.selectable]="selectMode"
          [class.selected]="selectedIds.has(loan.id)"
          (click)="onClick(loan.id)">
            <td>{{loan.name}}</td>
            <td>$\{{loan.balance.toFixed(2)}}</td>
            <td>{{loan.rate.toFixed(2)}}%</td>
            <td>$\{{loan.minimum.toFixed(2)}}</td>
            <td>{{loan.order}}-first</td>
            <td>{{formatDate(loan.date)}}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styleUrl: './list-view.scss'
})
export class ListItem {
  @Input() loanObjectList!: LoanObject[];
  @Input() selectMode = false;
  @Input() selectedIds = new Set();
  @Output() toggleSelection = new EventEmitter<number>();
  @Output() deleteLoanItem = new EventEmitter<number>();

  onClick(id:number) {
    if(this.selectMode) this.toggleSelection.emit(id);
  }

  onDelete(event: MouseEvent) {
    event?.stopPropagation();
    this.deleteLoanItem.emit(2);
  }

  formatDate(d: string) {
    const a = d.split('-');
    const year: number = Number(a[0]);
    const month: number = Number(a[1]);
    const day: number = Number(a[2]);

    let date: Date = new Date(Date.UTC(year, month, day));

    return date.toLocaleDateString("en-US", {year:"numeric", month:"short", day:"numeric"})
  }
}
