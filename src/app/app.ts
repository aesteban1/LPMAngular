import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dashboard } from "./dashboard/dashboard";
import { Modal } from "./modal/modal";
import { LoanObject } from './types/loan-entry';
import { LoanService } from './services/loanService';
import { LoanUiService } from './services/loan-ui-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Dashboard, Modal],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  modalUI: LoanUiService = inject(LoanUiService);
  modalOpen = this.modalUI.modalOpen;
  modalMode = this.modalUI.modalMode;
  modalData = this.modalUI.editingLoan;

  loanService: LoanService = inject(LoanService);

  ngOnInit() {
    this.loanService.getAllLoans();
  }

  openAddModal() {
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
    this.modalData.set(null);
    this.modalMode.set('add');
  }

  async addLoanToList(data: Omit<LoanObject, 'id'>){
    const created = await this.loanService.postLoan(data);
    this.loanService.addLoan(created);
    this.closeModal();
  }

  async updateLoanItem(data: LoanObject) {
    const updated = await this.loanService.updateLoan(data);
    this.loanService.updateItem(updated);
    this.closeModal();
  }

  async deleteLoanItem(id: number) {
    const deleted = await this.loanService.deleteLoan(id);
    this.closeModal();
  }
}