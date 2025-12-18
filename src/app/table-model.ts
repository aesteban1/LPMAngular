import {signal, computed } from '@angular/core'
import { ColumnDef } from './types/columnDef'

type columnKey<T> = keyof T | string; //allow string for computed columns

export class TableModel<T extends Record<string, any>> {
  private _data = signal<T[]>([]);  //table data rows
  private _columns = signal<ColumnDef<T>[]>([]);  //column definitions
  private _sort = signal<{key: columnKey<T>; dir: 'asc' | 'desc' } | null>(null); //current sort state

  //expose read-only signals (for component use)
  data = this._data.asReadonly();
  columns = this._columns.asReadonly();
  sort = this._sort.asReadonly();

  //calculates how many columns have the visible property set to true
  visibleCount = computed(() => this._columns().filter(c => c.visible).length);

  //computed view
  view = computed(() => {
    const rows = this._data();  //get current data
    const active = this._sort(); //get current sort state
    if(!active) return rows; //no sorting applied

    const cols = this._columns(); //get current columns
    const col = cols.find(c => c.key === active.key); //find the active sort column
    if(!col) return rows; //invalid column key

    const getSortvalue = (row: T): unknown => {
      if(col.sortValue) return col.sortValue(row);  //use custom sortValue function if provided
      if(col.value) return col.value(row);  //use custom value function if provided
      return (row as any)[col.key] ?? undefined; //default to direct property access
    };

    const direction = active.dir === 'asc' ? 1 : -1;  //sort direction multiplier

    //return sorted copy of data
    return [...rows].sort((a,b) => {
      return this.compareValues(getSortvalue(a), getSortvalue(b)) * direction;  //compare and apply direction
    });
  })

  //basic API
  setData(data: T[]) {
    this._data.set(data);
  }

  setColumns(cols: ColumnDef<T>[]) {
    this._columns.set(cols);
  }

  //Cycles through the sort options
  sortBy(key: columnKey<T>) {
    const current = this._sort(); //get current sort state

    if(!current || current.key !== key) {
      this._sort.set({key, dir: 'asc'})
    } else if (current.dir === 'asc') {
      this._sort.set({key, dir: 'desc'})
    }else {
      this._sort.set(null);
    }
  }

  //Returns formatted cell value based on column key
  getCell(row: T, col: ColumnDef<T>): unknown {
    const key = col.key;

    //Get raw value using value function or direct property access
    const raw = col.value
      ? col.value(row) 
      : (row as any)[key];

    if(key === 'principal' || key === 'minimum' || key === 'interest' || key === 'balance' || key === 'amount') {
      if(raw == null || raw == '') return '$0.00';
      const num = typeof raw === 'number' ? raw : Number(raw);
      
      return `$${num.toFixed(2)}`; //format as currency
    }

    if(key === 'rate') {
      if(raw ==null || raw == '') return '0.00%';
      const num = typeof raw === 'number' ? raw : Number(raw);
      return `${num.toFixed(2)}%`; //format as percentage
    }

    return raw; //return raw value
  }

  //Toggles the visibility property for ColumnDef data types
  toggleColumn(key: columnKey<T>) {
    this._columns.update(cols => {
      const visibleCount = cols.filter(c => c.visible).length;  //current count of visible columns

      return cols.map(c => {
        if(c.key !== key) return c; //not the target column, return as-is

         //If hiding, ensure we don't go below minimum visible columns (3)
        if(visibleCount <= 3 && c.visible) return c;  //prevent hiding below the minimum columns displayable (3)

        return {...c, visible: !c.visible}; //toggle visibility
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