export interface ColumnDef<T> {
  key: keyof T;                         //the property name (eg. 'balance')
  label: string;                       //header text (eg. 'Balance')
  visible: boolean;                   //whether it should be shown
  sortable?: boolean;                //whether clicking the header sorts it
  direction: 'asc' | 'desc' | null; //current sort order
}