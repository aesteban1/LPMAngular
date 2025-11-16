import { Component, Input, Output, EventEmitter, signal, inject, effect, HostListener, ElementRef, Host} from '@angular/core';
import { type LoanObject } from '../types/loan-entry';
import { TableModel } from '../table-model';
import { type ColumnDef } from '../types/columnDef';
import { LoanService } from '../services/loanService';
import { Dropdownservice } from '../services/dropdownservice';
import { LoanUiService } from '../services/loan-ui-service';
import { Loadingcontent } from '../loadingcontent/loadingcontent';

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
                  {{table.sort()?.dir === 'asc' ? '⬇' : '⬆'}}
                </span>
              }
              </th>
            }
          }
          <th>
            @if(selectMode){
              <label for="checkbox" class="checkbox-container">
                <input type="checkbox" name="checkbox" class="checkbox" [checked]="allSelected">
                <span class="custom-check" (click)="onAllClick($event)"></span>
              </label>
            }
          </th>
        </tr>
      </thead>

      <tbody>
        @for(loan of table.view(); track loan.id){
          <tr 
          (click)="onClick(loan.id)"
          [class.selectable]="selectMode"
          [class.selected]="selectedIds.has(loan.id)">
            @for(col of table.columns(); track col.key){
              @if(col.visible) {
                <td>{{table.getCell(loan, col.key)}}</td>
              }
            }
            @if(selectMode) {
                <td>
                <label for="checkbox" class="checkbox-container">
                  <input type="checkbox" name="checkbox" class="checkbox" [checked]="selectedIds.has(loan.id)">
                  <span class="custom-check"></span>
                </label>
              </td>
            } @else {
              <td>
                <div class="dropdown-container">
                  <button class="dropdown-btn primary" (click)="toggleDropdown($event, loan.id)"></button>
                  <ul class="dropdown-menu"
                  [class.openDropdown]="openDropdowns().has(loan.id)"
                  [class.closeDropdown]="!openDropdowns().has(loan.id)">
                    <li class="dropdown-item expand-btn">
                      <button (click)="onExpand()">
                        <img src="./assets/expand.svg" alt="expand">Expand
                      </button>
                    </li>
                    <li class="dropdown-item edit-btn">
                      <button (click)="onEdit(loan)">
                        <img src="assets/edit.svg" alt="edit">Edit
                      </button>
                    </li>
                    <li class="dropdown-item delete-btn">
                      <button (click)="onDelete($event, loan.id)">
                        <img src="assets/trash.svg" alt="delete">Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
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
  @Input() selectedIds = new Set<number>();
  @Input({required: true}) table!: TableModel<LoanObject>; 
  @Input() allSelected = false;
  @Output() toggleSelection = new EventEmitter<number>();
  @Output() deleteLoanItem = new EventEmitter<number>();
  @Output() toggleAll = new EventEmitter<any>();




  private el = inject(ElementRef);
  modalUI: LoanUiService = inject(LoanUiService);
  openDropdowns = signal<Set<number>>(new Set());

  @HostListener('document:click', ['$event'])
  onEvoke(event: MouseEvent) {
    const clickInside = this.el.nativeElement.contains(event.target);
    if(!clickInside) {
      this.closeAllDropdowns();
    }
  }

  toggleDropdown(event:MouseEvent, loanId: number) {
    event?.stopPropagation();
    this.openDropdowns.update(set => {
      const newSet = new Set(set);
      if(newSet.has(loanId)) newSet.delete(loanId)
      else newSet.clear(), newSet.add(loanId)
      return newSet
    })
  }

  closeAllDropdowns() {
    this.openDropdowns.set(new Set());
  }

  onClick(id:number) {
    if(this.selectMode) this.toggleSelection.emit(id); //dashboard holds all selected entries to allow.
  }

  onAllClick(event: MouseEvent) {
    event.stopPropagation();
    if(this.selectMode) this.toggleAll.emit();//emit the event of the select all checkbox being clicked.
  }

  onDelete(event: MouseEvent, id: number) {
    event?.stopPropagation();
    this.deleteLoanItem.emit(id);//emit the ID for the loan to be removed.
  }

  onEdit(loanObject: LoanObject) {
    this.modalUI.editingLoan.set(loanObject);
    this.modalUI.modalMode.set('edit');
    this.modalUI.modalOpen.set(true);
    this.closeAllDropdowns();
  }

  onExpand() {
    console.log('expand clicked!')
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