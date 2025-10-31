import { Injectable, signal } from '@angular/core';
import { type LoanObject } from '../types/loan-entry';


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
}
