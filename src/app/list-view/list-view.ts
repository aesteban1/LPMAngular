import { Component, Input, Output, EventEmitter, signal, inject, effect} from '@angular/core';
import { type LoanObject } from '../types/loan-entry';
import { TableModel } from '../table-model';
import { type ColumnDef } from '../types/columnDef';
import { LoanService } from '../services/loanService';

@Component({
  selector: 'app-list-item',
  imports: [],
  standalone: true,
  template: `
    <table [class.selectMode]="selectMode">
      <thead>
        <tr>
          @for(col of table.columns(); track col.key){
            @if(col.visible) {
              <th 
              (click)="table.sortBy(col.key)"
              [class.sortable]="col.sortable"
              >
              {{col.label}}
              @if(table.sort()?.key === col.key){
                <span class="sort-indicator">
                  {{table.sort()?.dir === 'asc' ? '⬇️' : '⬆️'}}
                </span>
              }
              </th>
            }
          }
        </tr>
      </thead>

      <tbody>
        @for(loan of table.view(); track loan.id){
          <tr>
            @for(col of table.columns(); track col.key){
              @if(col.visible) {
                <td>{{table.getCell(loan, col.key)}}</td>
              }
            }
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
  @Input({required: true}) table!: TableModel<LoanObject>; 
  @Output() toggleSelection = new EventEmitter<number>();
  @Output() deleteLoanItem = new EventEmitter<number>();

  onClick(id:number) {
    if(this.selectMode) this.toggleSelection.emit(id);
  }

  onDelete(event: MouseEvent) {
    event?.stopPropagation();
    this.deleteLoanItem.emit(2);//emit the ID for the loan to be removed  
  }

  formatDate(d: string) {
    const a = d.split('-');
    const year: number = Number(a[0]);
    const month: number = Number(a[1]);
    const day: number = Number(a[2]);

    let date: Date = new Date(Date.UTC(year, month, day));

    return date.toLocaleDateString("en-US", {year:"numeric", month:"short", day:"numeric"});
  }
}
