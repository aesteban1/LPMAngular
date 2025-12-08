import { Injectable, signal } from '@angular/core';
import { LoanObject } from '../types/loan-entry';

@Injectable({
  providedIn: 'root'
})
export class LoanUiService {
  modalOpen = signal(false);
  modalMode = signal<'add' | 'edit'>('add');
  detailsOpen = signal(false);

  targetLoan = signal<LoanObject | null>(null);


  openEditModal(loan: LoanObject) {
    this.targetLoan.set(loan);
    this.modalMode.set('edit');
    this.modalOpen.set(true);
  }

  openAddModal() {
    this.modalMode.set('add');
    this.modalOpen.set(true);
  }

  openDetails(loan: LoanObject) {
    this.targetLoan.set(loan);
    this.detailsOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
    this.targetLoan.set(null);
    this.modalMode.set('add');
  }

  closeDetails() {
    this.detailsOpen.set(false);
    this.targetLoan.set(null);
  }

}
