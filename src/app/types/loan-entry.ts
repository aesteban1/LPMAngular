type LoanHistoryEntry = {
  date: string, //ISO date
  balance: number,  //balance at time of entry
  interestAccrued: number, //interest accrued since last entry
  principalPaid: number, //principal paid since last entry
  paymentMade: number //payment made since last entry
}

export interface LoanObject {
  id: number, //loan identifier
  name: string, //loan name
  balance: number,  //current balance
  interest?: number, //current interest accrued
  principal?: number, //current principal
  rate: number, //interest rate as percentage
  minimum: number,  //minimum payment amount
  date?: string, //ISO date of last payment
  order: "interest" | "principal",  //payment allocation order
  history?: LoanHistoryEntry[] //array of history entries
}