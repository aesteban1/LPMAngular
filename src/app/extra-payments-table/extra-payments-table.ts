import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ExtraPayment } from '../types/loan-entry';
import { TableModel } from '../table-model';

@Component({
  selector: 'app-extra-payments-table',
  imports: [],
  standalone: true,
  template: `
    <div class="extra-payments-header">
      <h3>Extra Payments</h3>
      <button type="button" class="primary" (click)="addPayment()">Add Payment</button>
    </div>

    <div class="extra-payments-table-container">
      @if(table.view().length > 0) {
      <table class="extra-payments">
        <thead>
          <tr>
            @for(col of table.columns(); track col.key) {
            <th [class.sortable]="col.sortable" (click)="col.sortable && table.sortBy(col.key)">
              {{ col.label }}
              @if(table.sort()?.key === col.key){
              {{ table.sort()?.dir === 'asc' ? '⬇' : '⬆' }}
              }
            </th>
            }
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for(payment of table.view(); track $index) {
          <tr>
            <td>{{ payment.date }}</td>
            <td>{{ '$' + payment.amount.toFixed(2) || (0).toFixed(2) }}</td>
            <td>{{ payment.note || 'No Note Included' }}</td>
            <td>
              <div class="utility-container">
                <button class="utility" (click)="editPayment()">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="edit"
                  >
                    <g clip-path="url(#clip0_42_6)">
                      <path
                        d="M15.9599 4.80004L8.80493 11.955C8.09243 12.6675 5.9774 12.9975 5.5049 12.525C5.0324 12.0525 5.3549 9.9375 6.0674 9.225L13.2299 2.06252C13.4066 1.86981 13.6204 1.71491 13.8586 1.60713C14.0967 1.49936 14.3543 1.44093 14.6156 1.43543C14.8769 1.42993 15.1367 1.47743 15.3792 1.57509C15.6217 1.67275 15.8419 1.81855 16.0265 2.00365C16.211 2.18875 16.3562 2.40932 16.4532 2.65207C16.5502 2.89482 16.5971 3.1547 16.5908 3.41603C16.5846 3.67737 16.5254 3.93476 16.4171 4.17263C16.3086 4.41049 16.1531 4.62393 15.9599 4.80004Z"
                        stroke="#825dff"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.25 3H4.5C3.70435 3 2.94133 3.31606 2.37872 3.87868C1.81612 4.44129 1.5 5.20435 1.5 6V13.5C1.5 14.2957 1.81612 15.0587 2.37872 15.6213C2.94133 16.1839 3.70435 16.5 4.5 16.5H12.75C14.4075 16.5 15 15.15 15 13.5V9.75"
                        stroke="#825dff"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_42_6">
                        <rect width="18" height="18" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <button class="utility" (click)="removePayement($index, $event)">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 17 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="delete"
                  >
                    <path
                      d="M1 3.66693H16M12.25 3.66693L11.9963 2.94521C11.7504 2.24581 11.6274 1.89612 11.3994 1.63757C11.198 1.40926 10.9395 1.23254 10.6473 1.12362C10.3165 1.00026 9.92781 1.00026 9.15025 1.00026H7.84975C7.07219 1.00026 6.6835 1.00026 6.35267 1.12362C6.06055 1.23254 5.80195 1.40926 5.60058 1.63757C5.37255 1.89612 5.24961 2.24581 5.00373 2.94521L4.75 3.66693M14.125 3.66693V12.7336C14.125 14.2271 14.125 14.9738 13.8184 15.5443C13.5488 16.046 13.1186 16.4539 12.5894 16.7096C11.9877 17.0003 11.2002 17.0003 9.625 17.0003H7.375C5.79985 17.0003 5.01228 17.0003 4.41065 16.7096C3.88144 16.4539 3.45119 16.046 3.18154 15.5443C2.875 14.9738 2.875 14.2271 2.875 12.7336V3.66693M10.375 7.22248V13.4447M6.625 7.22248V13.4447"
                      stroke="#ff0000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          }
        </tbody>
      </table>
      } @else {
      <p>No extra payments defined</p>
      }
    </div>
  `,
  styleUrl: './extra-payments-table.scss',
})
export class ExtraPaymentsTable implements OnChanges {
  @Input() payments: ExtraPayment[] = []; //*Can be a loan's defined extra payments or a new loan's extra payments

  @Output() paymentsChange = new EventEmitter<ExtraPayment[]>(); //*We emit the updated extra payments to the parent component so that it can update its loan object

  //*create the table using the table model class
  table = new TableModel<ExtraPayment>();

  //*Define the columns
  constructor() {
    this.table.setColumns([
      { key: 'date', label: 'Date', visible: true, sortable: true, direction: null },
      { key: 'amount', label: 'Amount', visible: true, sortable: true, direction: null },
      { key: 'note', label: 'Note', visible: true, sortable: true, direction: null },
    ]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['payments']) {
      this.table.setData(this.payments ?? []);
    }
  }

  addPayment() {
    //!placeholder variable for testing
    //!Real variable will use the user's input
    const next: ExtraPayment = {
      date: new Date().toISOString().slice(0, 10),
      amount: 0,
      note: '',
    };

    const updated = [...(this.payments ?? []), next];

    this.payments = updated;
    console.log(updated);
    this.table.setData(updated);
    this.paymentsChange.emit(updated); //*We emit it so that the array can be used by the modal to update or create a loan object
  }

  removePayement(index: number, e: MouseEvent) {
    e.preventDefault();
    const updated = this.payments.filter((_, i) => i != index);
    this.paymentsChange.emit(updated);
    this.table.setData(updated);
  }

  editPayment() {
    console.log('edit clicked!');
  }
}
