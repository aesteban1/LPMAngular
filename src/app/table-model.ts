import {signal, computed } from '@angular/core'
import { ColumnDef } from './types/columnDef'

export class TableModel<T extends Record<string, any>> {
  //reactive state
  private _data = signal<T[]>([]);
  private _columns = signal<ColumnDef<T>[]>([]);
  private _sort = signal<{key: keyof T; dir: 'asc' | 'desc' } | null>(null);

  //expose read-only signals (for component use)
  data = this._data.asReadonly();
  columns = this._columns.asReadonly();
  sort = this._sort.asReadonly();

  //calculates how many columns have the visible property set to true
  visibleCount = computed(() => this._columns().filter(c => c.visible).length);

  //computed view
  view = computed(() => {
    ///Updated automaically when _data or _sort change
    const data = this._data();
    const sort = this.sort();

    if(!sort) return data; //sort is not defined, use default sort order

    const { key, dir } = sort;
    const direction = dir === 'asc' ? 1 : -1; //retrieve the sort direction

    return data.sort((a,b) => this.compareValues(a[key], b[key]) * direction)
  });

  //basic API
  setData(data: T[]) {
    this._data.set(data);
  }

  setColumns(cols: ColumnDef<T>[]) {
    this._columns.set(cols);
  }

  //Cycles through the sort options
  sortBy(key: keyof T) {
    const current = this._sort();
    if(!current || current.key !== key) {
      this._sort.set({key, dir: 'asc'})
    } else if (current.dir === 'asc') {
      this._sort.set({key, dir: 'desc'})
    }else {
      this._sort.set(null);
    }
  }

  //obtains data given a variable (row) and a type (T) to look for
  getCell(row: T, key: keyof T) {
    if(key === 'balance' || key === 'minimum') {
      return `$${row[key].toFixed(2)}`
    }else if(key === 'rate'){
      return `${row[key].toFixed(2)}%`
    }
    return row[key];
  }

  formatCell(row: T, key: keyof T) {

  }

  //Toggles the visibility property for ColumnDef data types
  toggleColumn(key: keyof T){
    this._columns.update(cols => {
      const visibleCount = cols.filter(c => c.visible).length;

      return cols.map(c => {
        if(c.key !== key) return c;
        //prevent hiding below the minimum columns displayable (3)
        if(visibleCount <= 3 && c.visible) return c;

        return {...c, visible: !c.visible};
      });
    });
  }

  //helper method
  private compareValues(a: any, b: any): number {
    //handle null/undefined
    if(a===null && b===null) return 0;
    if(a===null) return -1;
    if(b===null) return 1;

    //Numeric sort
    if(typeof a === 'number' && typeof b === 'number') {
      return a-b
    }

    //Date string (detect ISO format)
    if(typeof a === 'string' && /^\d{4}-\d{2}-\d{2}/.test(a) && 
       typeof b === 'string' && /^\d{4}-\d{2}-\d{2}/.test(b)) {
        return a.localeCompare(b);
      }

    //Default string compare
    return String(a).localeCompare(String(b));
  }
}