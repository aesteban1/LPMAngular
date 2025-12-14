import { Component, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges} from '@angular/core';
import { ExtraPayment, LoanObject } from '../types/loan-entry';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ExtraPaymentsTable } from '../extra-payments-table/extra-payments-table';

@Component({
  selector: 'app-modal',
  imports: [ReactiveFormsModule, ExtraPaymentsTable],
  template: `
  <div class="modal-content"
  [class.expanded] = "expanded()">
    <header>
      <h2>
        {{modalMode == "edit" ? 'Editing Loan Entry' : 'Adding New Entry'}}
      </h2>
      <button class="close primary" (click)="closeModal()">x</button>
    </header>
    <!--//? redesign form to be grid based, more compact and to include extra payments section -->
    <form id="form" [formGroup]="form" (submit)="onSubmit($event)">

    <section class="main-form-content">
      <label>Loan Name
        <div class="input-container">
          <input type="text" formControlName="name" class="name form-input" placeholder="Loan name">
        </div>
      </label>

      <label>Balance
        <div class="input-container">
          <span class="symbol">$</span>
          <input type="number" class="balance form-input" [value]="computedBalance" placeholder="0.00" disabled>
        </div>
      </label>

      <label>Principal
        <div class="input-container">
          <span class="symbol">$</span>
          <input type="number" step="0.1" min="0" formControlName="principal" class="principal form-input" placeholder="Loan Principal">
        </div>
      </label>

      <label>Interest
        <div class="input-container">
          <span class="symbol">$</span>
          <input type="number" step="0.1" min="0" formControlName="interest" class="interest form-input" placeholder="Accrued Interest">
        </div>
      </label>

      <label>APR
        <div class="input-container">
          <input type="number" step="0.1" min="0" formControlName="rate" class="rate form-input" placeholder="Loan APR">
          <span class="symbol">%</span>
        </div>
      </label>

      <label>Minimum Payment
        <div class="input-container">
          <span class="symbol">$</span>
          <input type="number" step="0.1" min="0" formControlName="minimum" class="minimum form-input" placeholder="Minimum payment">
        </div>
      </label>

      <label class="date-menu">Recent payment
        <div class="input-container">
          <input type="date" formControlName="date" class="payDate form-menu">
          <div class="tooltip-container">?
            <span class="tooltip-text">If there is no recent payment, select toady's date</span>
          </div>
        </div>
      </label>
      
</section>

      @if(expanded()){
        <section class="extra-payments-section">
          <app-extra-payments-table 
          (paymentsChange)="updateExtraPayments($event)"
          [payments]="loanObject.extraPayments ? loanObject.extraPayments : []">
          </app-extra-payments-table>
        </section>
      }

      <div class="actions">
        <button class="primary more-details" type="button" (click)="toggleExpansion()"> More Details</button>
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

  expanded = signal(false);

  extraPaymetsData: ExtraPayment[] = [];

  form = new FormGroup({
    name: new FormControl('', {nonNullable: true}),
    principal: new FormControl(),
    interest: new FormControl(),
    rate: new FormControl(),
    minimum: new FormControl(),
    date: new FormControl('')
  })

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['modalData'] && this.modalData) {
      //Patch the form with the incoming data
      this.form.patchValue({
        name: this.modalData.name ?? '',
        principal: this.modalData.principal ?? 0,
        interest: this.modalData.interest ?? 0,
        rate: this.modalData.rate ?? 0,
        minimum: this.modalData.minimum ?? 0,
        // order: this.modalData.order ?? 'interest',
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

  toggleExpansion() {
    this.expanded.update( b => !b);
  }

  updateExtraPayments(array: ExtraPayment[]) {
    console.log(this.loanObject, array)
    this.loanObject.extraPayments = [...array]
  }

  getBalance(): number {
    if(this.modalData) {
      return this.modalData.principal! + this.modalData.interest!;
    }
    return 0;
  }

  get computedBalance(): number {
    const principal = this.form.get('principal')?.value || 0;
    const interest = this.form.get('interest')?.value || 0;
    return principal + interest;
  }

  closeModal() {
    this.form.reset({
      name: '',
      principal: 0,
      interest: 0,
      rate: 0,
      minimum: 0,
      // order: 'interest',
      date: ''
    })
    this.close.emit()
  }

}