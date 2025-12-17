import { Component , EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import { ExtraPayment } from '../types/loan-entry';
import { TableModel } from '../table-model';

@Component({
  selector: 'app-extra-payments-table',
  imports: [],
  standalone: true,
  template: `
    <div class="extra-payments-header">
      <h3>Extra Payments</h3>
      <button type="button" class="primary" (click)="addPayment()">Add payment</button>
    </div>

    @if(table.view().length > 0) {
      <table>
        <thead>
          <tr>
            @for(col of table.columns(); track col.key) {
              <th
              [class.sortable] = "col.sortable"
              (click)="col.sortable && table.sortBy(col.key)">
              {{col.label}}
                @if(table.sort()?.key === col.key){
                  {{table.sort()?.dir === 'asc' ? '⬇' : '⬆'}}
                }
              </th>
            }
          </tr>
        </thead>
        <tbody>
            @for(payment of table.view(); track $index) {
              <tr>
                <td>{{payment.date}}</td>
                <td>{{payment.amount || 0}}</td> //?decimal pipe
                <td>{{payment.note || '---'}}</td>
              </tr>
            }
        </tbody>
      </table>
    } @else {
      <p>No Extra payments defined.</p>
    }
  `,
  styleUrl: './extra-payments-table.scss'
})
export class ExtraPaymentsTable implements OnChanges{

  @Input() payments: ExtraPayment[] = []; //*Can be a loan's defined extra payments or a new loan's extra payments

  @Output() paymentsChange = new EventEmitter<ExtraPayment[]>(); //*We emit the updated extra payments to the parent component so that it can update its loan object

  //*create the table using the table model class
  table =  new TableModel<ExtraPayment>();

  //*Define the columns
  constructor() {
    this.table.setColumns([
      {key:'date', label:'Date', visible: true, sortable: true, direction: null},      
      {key:'amount' , label:'Amount', visible:true , sortable: true, direction: null},
      {key:'note' , label:'Note', visible:true , sortable: true, direction: null}
    ])
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['payments']) {
      this.table.setData(this.payments ?? []);
    }
  }

  addPayment() {
    //!placeholder variable for testing
    //!Real variable will use the user's input
    const next: ExtraPayment = {
      date: new Date().toISOString().slice(0,10),
      amount: 0,
      note: ''
    }

    const updated = [...(this.payments ?? []), next];

    this.payments = updated;
    console.log(updated);
    this.table.setData(updated);
    this.paymentsChange.emit(updated); //*We emit it so that the array can be used by the modal to update or create a loan object
  }

  removePayement(index: number) {
    const updated = this.payments.filter((_, i) => i != index);
    this.paymentsChange.emit(updated);
    this.table.setData(updated);
  }
}