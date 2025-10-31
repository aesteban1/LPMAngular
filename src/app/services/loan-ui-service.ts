import { Injectable, signal } from '@angular/core';
import { LoanObject } from '../types/loan-entry';

@Injectable({
  providedIn: 'root'
})
export class LoanUiService {
  modalOpen = signal(false);
  modalMode = signal<'add' | 'edit'>('add');
  editingLoan = signal<LoanObject | null>(null);

  openEditModal(loan: LoanObject) {
    this.editingLoan.set(loan);
    this.modalMode.set('edit');
    this.modalOpen.set(true);
  }

  openAddModal() {
    this.modalMode.set('add');
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
    this.editingLoan.set(null);
    this.modalMode.set('add');
  }
}
