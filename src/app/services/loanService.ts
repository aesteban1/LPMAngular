import { Injectable, signal } from '@angular/core';
import { LoanHistoryEntry, type LoanObject } from '../types/loan-entry';
import { buildProjectionForLoan } from '../utilities/loan-projection';


@Injectable({
  providedIn: 'root'
})
export class LoanService {
  url = "http://localhost:3000/loans";
  isLoading = signal(false);
  loanObjectList = signal<LoanObject[]>([]);

  addLoan(loan:LoanObject) {
    this.loanObjectList.update(list => [...list, loan]);
  }

  removeLoan(id: number) {
    this.loanObjectList.update(list => list.filter(loan => loan.id !== id))
  }

  updateItem(updated: LoanObject){
    this.loanObjectList.update(list => 
      list.map(item => item.id === updated.id ? updated : item)
    );
  }

  //Todo: What about manually added history entries?
  //Todo: Manually added payments? Random extra payments? New modal? or inline editing? service method to add history entry or extra payments?

  getSchedule(loan: LoanObject): LoanHistoryEntry[]{
    const history = loan.history ?? []

    const lastEntry = history[history.length -1]; //get last history entry
    const startDate = lastEntry?.date ?? new Date(Date.now()).toISOString().slice(0,10);

    const projection = buildProjectionForLoan(loan, startDate);

    return [...history, ...projection];
  }

  async getAllLoans():Promise<LoanObject[]> {
    this.isLoading.set(true);
    try {
      const res = await fetch(this.url,{
      method: 'GET',
      headers:{
        'Content-Type' : 'application/json'
      }
    })
    const data = await res.json() as LoanObject[];
    this.loanObjectList.set(data ?? []);

    return data ?? [];
    } catch (error) {
      console.error('Failed to fetch loans:', error);
      this.loanObjectList.set([]);
      return [];
    }finally{
      this.isLoading.set(false);
    }
  }

  async postLoan(data: Omit<LoanObject, 'id'>): Promise<LoanObject> {
    try {
      const msg = await fetch(this.url, {
        method: "POST",
        headers:{
          'Content-Type' : 'application/json'
        },
        body:JSON.stringify(data)
      })
      return await msg.json();

    } catch (error) {
      console.error('Error sending loan data: ', error);
      throw error;
    }
  }

  async deleteLoan(id:number) {
    try {
      const res = await fetch(`${this.url}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type' : 'application/json'}
      });

      if(!res.ok) {
        throw new Error(`HTTP error! satus: ${res.status}`);
      }

      if(res.status === 204) {
        this.removeLoan(id);
        return null;
      }
      const deleted = await res.json();
      this.removeLoan(id);
      return deleted;
    } catch (error) {
      console.error('Error deleting loan: ', error);
      throw error;
    }
  }

  async deleteMultipleLoans(set: Set<number>) {
    const ids = [...set];
    const results = await Promise.allSettled(
      ids.map(id => this.deleteLoan(id))
    )

    const failed = results.filter(r => r.status === 'rejected');
    if(failed.length) {
      console.warn(`${failed.length} deletions failed.`);
    }
  }

  async updateLoan(data: LoanObject): Promise<LoanObject> {
    // this.isLoading.set(true);
    try {
      const msg = await fetch(`${this.url}/${data.id}`, {
        method: "PUT",
        headers:{
          'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
      
      if(!msg.ok){throw new Error(`HTTP error! status: ${msg.status}`)}

      const updated = await msg.json();

      this.updateItem(updated);
      return updated;
    } catch (error) {
      console.error(`Error updating loan`, error);
      throw error;
    }
    // finally {
    //   this.isLoading.set(false);
    // }
  }
}