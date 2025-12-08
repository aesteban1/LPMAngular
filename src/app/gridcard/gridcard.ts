import { Component, EventEmitter, inject, Input, Output, signal, HostListener, ElementRef, Host, effect} from '@angular/core';
import { LoanObject } from '../types/loan-entry';
import { LoanUiService } from '../services/loan-ui-service';
import { Dropdownservice } from '../services/dropdownservice';

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
                <li class="dropdown-item expand-btn">
                  <button (click)="onExpand(loanObject)">
                    <img src="./assets/expand.svg" alt="expand">Expand
                  </button>
                </li>
                <li class="dropdown-item edit-btn">
                  <button (click)="onEdit(loanObject)">
                    <img src="assets/edit.svg" alt="edit">Edit
                  </button>
                </li>
                <li class="dropdown-item delete-btn">
                  <button (click)="onDelete($event)">
                    <img src="assets/trash.svg" alt="delete">Delete
                  </button>
                </li>
              </ul>
            </div>
          }
        </header>
        <li>
          <span class="label">Balance: </span>
          <p>$\{{getBalance().toFixed(2)}}</p>
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

  private el = inject(ElementRef);
  modalUI: LoanUiService = inject(LoanUiService);
  dropdowns = inject(Dropdownservice);

  showDropdown = signal(false);
  dropdownId = `dropdown-${crypto.randomUUID()}`;

  constructor() {
    effect(() => {
      const activeId = this.dropdowns.activeDropdownId();
      if (activeId !== this.dropdownId) {
        this.showDropdown.set(false);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.el.nativeElement.contains(event.target);
    if(!clickedInside) {
      this.closeDropdown();
    }
  }

  toggleDropdown(event: MouseEvent) {
    event?.stopPropagation()
    const isOpen = this.dropdowns.isOpen(this.dropdownId);

    this.dropdowns.close();

    if (!isOpen) {
      this.dropdowns.open(this.dropdownId);
      this.showDropdown.set(true);
    } else {
      this.showDropdown.set(false);
    }
  }

  closeDropdown() {
    this.showDropdown.set(false);
    if(this.dropdowns.isOpen(this.dropdownId)) {
      this.dropdowns.close();
    }
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.deleteLoanItem.emit(this.loanObject.id);
    this.closeDropdown();
  }

  onEdit(loanObject: LoanObject) {
    this.modalUI.targetLoan.set(loanObject);
    this.modalUI.modalMode.set('edit');
    this.modalUI.modalOpen.set(true);
    this.closeDropdown();
  }

  onExpand(loan: LoanObject) {
    this.modalUI.targetLoan.set(loan);
    this.modalUI.detailsOpen.set(true);
    this.closeDropdown();
  }

  onClick() {
    if(this.selectMode) this.toggleSelection.emit(this.loanObject.id)
  }

  getBalance(): number {
    return this.loanObject.principal + this.loanObject.interest;
  }

  formatDate(d?: string) {
    if (!d) return '';
    const a = d.split('-');
    const year: number = Number(a[0]);
    const month: number = Number(a[1]);
    const day: number = Number(a[2]);
    let date: Date = new Date(Date.UTC(year, month, day));
    return date.toLocaleDateString("en-US", {year:"numeric", month:"short", day:"numeric"})
  }
}