import { Component, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { LoanObject } from '../types/loan-entry';
import { NgApexchartsModule, ApexChart, ApexXAxis } from 'ng-apexcharts';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loan-details-modal',
  standalone: true,
  imports: [NgApexchartsModule, NgIf],
  template: `
    <div class="modal">
      <header>
        <h2>{{loan.name}} Details</h2>
        <!-- Add A Close Button -->
      </header>

      <section class="chart-section" *ngIf="series.length > 0; else noHistory">
        <apx-chart
          [series]="series"
          [chart]="chart"
          [xaxis]="xaxis"
        ></apx-chart>
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

  //Apex Types
  series: ApexAxisChartSeries = [];
  chart: ApexChart = {
    type: 'line',
    height: 350,
    toolbar: {
      show: true
    }
  };
  xaxis:ApexXAxis = {
    categories: []
  };

  ngOnChanges(changes: SimpleChanges) {
    if(changes['loan'] && this.loan && this.loan.history &&  this.loan.history.length > 0) {
      const history = this.loan.history;

      this.series = [
        {
          name: 'Balance',
          data: history.map(entry => entry.balance)
        }
      ];

      this.xaxis = {
        ...this.xaxis,
        categories: history.map(entry => entry.date)
      };
    } else {
      this.series = [];
      this.xaxis = {...this.xaxis, categories: [] };
    }
  }
}
