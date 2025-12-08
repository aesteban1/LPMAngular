import { Component, EventEmitter, inject, Input, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { LoanObject } from '../types/loan-entry';
import { NgApexchartsModule, ApexChart, ApexXAxis, ApexOptions} from 'ng-apexcharts';
import { NgIf } from '@angular/common';
import { LoanService } from '../services/loanService';

@Component({
  selector: 'app-loan-details-modal',
  standalone: true,
  imports: [NgApexchartsModule, NgIf],
  template: `
    <div class="modal-content">
      <header>
        <h2>{{loan.name}} Details</h2>
        <button class="close primary" (click)="closeModal()">x</button>
      </header>

      <section class="chart-section" *ngIf="series.length > 0; else noHistory">
        <apx-chart
          [series]="series"
          [chart]="chart"
          [xaxis]="xaxis"
          [tooltip]="tooltip"
          [stroke]="stroke"
        ></apx-chart>
      </section>
      <section>
        <!--Todo: additional loan details/stats
        //probably in cards below the chart
        //what stats would be useful?
        //chart types?-->
      </section>
      <ng-template #noHistory>
        <p>No historical data available for this loan.</p>
      </ng-template>
    </div>
  `,
  styleUrl: './loan-details-modal.scss'
})
export class LoanDetailsModal {
  @Input({required: true}) loan!: LoanObject;
  @Output() close = new EventEmitter<void>();

  loanService = inject(LoanService);

  //Apex Types
  series: ApexAxisChartSeries = [];
  chart: ApexChart = {
    type: 'line',
    height: 600,
    width: '100%',
    toolbar: {
      show: false
    }
  };
  xaxis:ApexXAxis = {
    categories: []
  };

  tooltip:ApexTooltip = {
    enabled: true,
    shared: true,
    theme: 'dark'
  };

  stroke = {
    width: [3, 2],
    dashArray: [0, 6]
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['loan'] && this.loan) {
      const schedule = this.loanService.getSchedule(this.loan);
      
      const history = schedule.filter(entry => entry.kind === "history");
      const projection = schedule.filter(entry => entry.kind === "projection");

      this.series = [
        {
          name: 'Balance (Actual)',
          data: schedule.map(entry =>
            entry.kind === 'history' ? entry.balance : null
          )
        },
        {
          name: 'Balance (Projected)',
          data: schedule.map(entry =>
            entry.kind === 'projection' ? entry.balance : null
          )
        }
      ];

      this.xaxis = {
        ...this.xaxis,
        categories: schedule.map(entry => entry.date)
      };
    }
  }

  closeModal() {
    this.close.emit();
  }
}
