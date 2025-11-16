export interface LoanObject {
  id: number,
  name: string,
  balance: number,
  rate: number,
  minimum: number,
  date: string,
  order: "interest" | "principal"
}
