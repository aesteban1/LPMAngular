import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dashboard } from "./dashboard/dashboard";
import { Modal } from "./modal/modal";
import { LoanDetailsModal } from './loan-details-modal/loan-details-modal';
import { LoanObject } from './types/loan-entry';
import { LoanService } from './services/loanService';
import { LoanUiService } from './services/loan-ui-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Dashboard, Modal, LoanDetailsModal],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  //Signals and Services
  modalUI: LoanUiService = inject(LoanUiService);
  modalOpen = this.modalUI.modalOpen;
  modalMode = this.modalUI.modalMode;
  modalData = this.modalUI.targetLoan;
  detailsOpen = this.modalUI.detailsOpen;

  loanService: LoanService = inject(LoanService);

  //Lifecycle Hooks
  ngOnInit() {
    this.loanService.getAllLoans();
  }

  openAddModal() {
    this.modalUI.openAddModal();
  }

  closeEntryModal() {
    this.modalUI.closeModal();
  }

  openDetailsModal(loan: LoanObject) {
    this.modalUI.openDetails(loan);
  }

  closeDetailsModal() {
    this.modalUI.closeDetails();
  }

  //CRUD Operations
  async addLoanToList(data: Omit<LoanObject, 'id'>){
    const created = await this.loanService.postLoan(data); //Assuming backend returns created object
    this.loanService.addLoan(created);
    this.closeEntryModal();
  }

  async updateLoanItem(data: LoanObject) {
    const updated = await this.loanService.updateLoan(data); //Assuming backend returns updated object
    this.loanService.updateItem(updated);
    this.closeEntryModal();
  }

  async deleteLoanItem(id: number) {
    const deleted = await this.loanService.deleteLoan(id); //Assuming backend returns deleted object
    this.closeEntryModal();
  }
}