import { Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import { LoanObject } from '../types/loan-entry';
import { LoanUiService } from '../services/loan-ui-service';

@Component({
  selector: 'app-gridcard',
  imports: [],
  standalone: true,
  template: `
      <div class="grid-card" 
        [class.selectable]="selectMode" 
        [class.selected]="selected"
        (click)="onClick()">
        <header class="card-header">
          <h3>{{loanObject.name}}</h3>
          @if(!selectMode){
            <div class="dropdown-container">
              <button class="dropdown-btn primary" (click)="toggleDropdown($event)"></button>
              <ul class="dropdown-menu"
              [class.openDropdown]="showDropdown()"
              [class.closeDropdown]="!showDropdown()">
                <li class="dropdown-item edit-btn">
                  <button (click)="onEdit(loanObject)">
                    <img src="assets/edit.svg" alt="pencil icon">Edit
                  </button>
                </li>
                <li class="dropdown-item delete-btn">
                  <button (click)="onDelete($event)">
                    <img src="assets/trash.svg" alt="trashIcon">Delete
                  </button>
                </li>
              </ul>
            </div>
          }
        </header>
        <li>
          <span class="label">Balance: </span>
          <p>$\{{loanObject.balance.toFixed(2)}}</p>
        </li>
        <li>
          <span class="label">Interest Rate: </span>
          <p>{{loanObject.rate.toFixed(2)}}%</p>
        </li>
        <li>
          <span class="label">Minimum Payment: </span>
          <p>$\{{loanObject.minimum.toFixed(2)}}</p>
          <span class="order">{{loanObject.order}}-first</span>
        </li>
        <li class="date">
          <span class="date-icon"></span>
          <span class="date-data">Last Payment: {{formatDate(loanObject.date)}}</span>
        </li>
      </div>
  `,
  styleUrl: './gridcard.scss'
})
export class Gridcard {
  @Input() loanObject!: LoanObject;
  @Input() selectMode = false;
  @Input() selected = false;
  @Output() toggleSelection = new EventEmitter<number>();
  @Output() deleteLoanItem = new EventEmitter<number>();
  showDropdown = signal(false);

  modalUI: LoanUiService = inject(LoanUiService);
  openModal = this.modalUI.modalOpen
  modalMode = this.modalUI.modalMode
  modalData = this.modalUI.editingLoan

  onClick() {
    if(this.selectMode) this.toggleSelection.emit(this.loanObject.id)
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.deleteLoanItem.emit(this.loanObject.id);
  }

  onEdit(loanObject: LoanObject) {
    this.modalData.set(loanObject);
    this.modalMode.set('edit');
    this.openModal.set(true);
  }

  toggleDropdown(event: MouseEvent) {
    event?.stopPropagation()
    this.showDropdown.update(u => !u);
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