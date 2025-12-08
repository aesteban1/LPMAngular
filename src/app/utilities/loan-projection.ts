import { LoanObject , LoanHistoryEntry} from "../types/loan-entry";

export function buildProjectionForLoan(
  loan: LoanObject,
  strtDate: String,
  maxMonths: number = 480
): LoanHistoryEntry[]{
  const projection: LoanHistoryEntry[] = [];

  //TODO: Implement the extra payment feature, how will this factor in?
  //? should the loan's current principal and interest mirror the last history entry?
  //*Constantly calculate from last history entry if exists
  let lastEntry: LoanHistoryEntry | undefined = loan.history ? loan.history[loan.history.length -1] : undefined;

  let balance = lastEntry ? lastEntry.balance : loan.principal + (loan.interest ?? 0); //*starting balance
  const r = loan.rate / 100 / 12; //*monthly interest rate
  let currentDate = new Date(strtDate.toString());

  for(let i=0; i < maxMonths && balance > 0; i++) {

    //*advance 1 month
    currentDate = new Date(
      currentDate.getFullYear(), 
      currentDate.getMonth() + 1, 
      currentDate.getDate());

      const interestAccrued = +(balance * r).toFixed(2); //interest accrued this month

      //adjust final payment if it exceeds remaining balance + interest
      if(loan.minimum > balance + interestAccrued) {
        loan.minimum = +(balance + interestAccrued).toFixed(2);
      }

      //payment applied to principal
      //cannot be negative
      //if minimum payment is less than interest accrued, principal paid is 0
      const principalPayment = loan.minimum > interestAccrued //
        ? loan.minimum - interestAccrued 
        : 0;
      
      const remainingPrincipal = balance - principalPayment;
      const remainingInterest = interestAccrued - loan.minimum < 0 ? 0 : interestAccrued - loan.minimum; //should not go negative

      const balanceAfterPayment = +(remainingPrincipal + remainingInterest).toFixed(2);
      const principalPaid = +(loan.minimum - interestAccrued < 0 ? 0 : principalPayment).toFixed(2);

      projection.push({
        date: currentDate.toISOString().split('T')[0],
        balance: balanceAfterPayment,
        interestAccrued: remainingInterest,
        principalPaid: principalPaid,
        paymentMade: loan.minimum,
        kind: "projection"
      });

      if(balance <= 0) break;

      balance = balanceAfterPayment;
    }

  return projection;
}