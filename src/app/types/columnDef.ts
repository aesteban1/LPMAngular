
type columnKey<T> = keyof T | string; //allow string for computed columns

export interface ColumnDef<T> {
  key: columnKey<T>;                    //unique column identifier, can be a real key or computed
  label: string;                       //header text (eg. 'Balance')
  visible: boolean;                   //whether it should be shown
  sortable?: boolean;                //whether clicking the header sorts it
  direction: 'asc' | 'desc' | null; //current sort order

  value?: (row: T) => unknown;      //function to get the cell value
  sortValue?: (row: T) => number | string; //function to get the sortable value
}