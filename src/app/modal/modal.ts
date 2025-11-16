import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import { LoanObject } from '../types/loan-entry';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  imports: [ReactiveFormsModule],
  template: `
  <div class="modal-content">
    <header>
      <h2>
        {{modalMode == "edit" ? 'Editing Loan Entry' : 'Add New Entry'}}
      </h2>
      <button class="close primary" (click)="closeModal()">x</button>
    </header>
    <form id="form" [formGroup]="form" (submit)="onSubmit($event)">
      <div class="input-container">
        <input type="text" formControlName="name" class="name form-input" placeholder="Loan name">
      </div>
      <div class="input-container">
        <span class="symbol">$</span>
        <input type="number" step="0.1" min="0" formControlName="balance" class="balance form-input" placeholder="Loan Balance">
      </div>
      <div class="input-container">
        <input type="number" step="0.1" min="0" formControlName="rate" class="rate form-input" placeholder="Loan APR">
        <span class="symbol">%</span>
      </div>
      <div class="input-container">
        <span class="symbol">$</span>
        <input type="number" step="0.1" min="0" formControlName="minimum" class="minimum form-input" placeholder="Minimum payment">
      </div>
      <select formControlName="order" class="order form-menu">
        <option value="">--Payment order--</option>
        <option value="interest">interest-first</option>
        <option value="principal">principal-first</option>
      </select>
      <div class="date-menu">
        <span>Recent payment: </span>
        <input type="date" formControlName="date" class="payDate form-menu">
        <div class="tooltip-container">?
          <span class="tooltip-text">If there is no recent payment, select toady's date</span>
        </div>
      </div>
      <div class="actions">
        <button class="primary" type="button" (click)="closeModal()">Cancel</button>
        <button class="primary" type="submit">Save</button>
        @if(modalMode === 'edit'){
          <button class="primary" type="button" (click)="onDelete($event)">Delete</button>
        }
      </div>
    </form>
  </div>
  `,
  styleUrl: './modal.scss'
})
export class Modal implements OnChanges{
  @Input() loanObject!: LoanObject;
  @Input() modalMode: 'add' | 'edit' = 'add';
  @Input() modalData: LoanObject | null = null
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();
  @Output() update = new EventEmitter<any>()

  form = new FormGroup({
    name: new FormControl('', {nonNullable: true}),
    balance: new FormControl(0),
    rate: new FormControl(0),
    minimum: new FormControl(0),
    order: new FormControl('interest'),
    date: new FormControl('')
  })

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['modalData'] && this.modalData) {
      //Patch the form with the incoming data
      this.form.patchValue({
        name: this.modalData.name ?? '',
        balance: this.modalData.balance ?? 0,
        rate: this.modalData.rate ?? 0,
        minimum: this.modalData.minimum ?? 0,
        order: this.modalData.order ?? 'interest',
        date: this.modalData.date ?? ''
      })
    }
  }

  onBackdropClick(event: MouseEvent) {
    if((event.target as HTMLElement).tagName !== 'FORM') {
      this.close.emit();
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if(this.form.invalid) return;

    const data = this.form.value as Omit<LoanObject, 'id'>

    if(this.modalMode === "edit" && this.modalData){
      this.update.emit({id: this.modalData.id, ...data})
    }else{
      this.save.emit(data);
    }
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.delete.emit(this.modalData?.id);
  }

  closeModal() {
    this.form.reset({
      name: '',
      balance: 0,
      rate: 0,
      minimum: 0,
      order: 'interest',
      date: ''
    })
    this.close.emit()
  }

}