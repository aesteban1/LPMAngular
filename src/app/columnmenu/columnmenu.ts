import { Component, Input } from '@angular/core';
import { TableModel } from '../table-model';
import { type ColumnDef } from '../types/columnDef';

@Component({
  selector: 'app-columnmenu',
  standalone:true,
  template: `
    <div class="column-menu">
      <strong>Columns:</strong>
      @for(col of table.columns(); track col.key){
        <label for="">
          <input type="checkbox"
          [checked]="col.visible"
          [disabled]="table.visibleCount() <= 3 && col.visible"
          (change)="table.toggleColumn(col.key)" />
          {{col.label}}
        </label>
      }
    </div>
  `,
  styleUrl: './columnmenu.scss'
})
export class Columnmenu<T extends Record<string, any>> {
  @Input({required: true}) table!: TableModel<T>;
}
