import { Component, computed, effect, EventEmitter, inject, Output,Input, signal, OnInit } from '@angular/core';
import { GridItem } from '../grid-view/grid-view';
import { type LoanObject } from '../types/loan-entry';
import { LoanService } from '../services/loanService';
import { ListItem } from '../list-view/list-view';
import { EmptyDisplay } from '../empty-display/empty-display';
import { Loadingcontent } from "../loadingcontent/loadingcontent";
import { LoanUiService } from '../services/loan-ui-service';
import { TableModel } from '../table-model';
import { Columnmenu } from '../columnmenu/columnmenu';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GridItem, ListItem, EmptyDisplay, Loadingcontent, Columnmenu],
  template: `
    <section class="dashboard">
      <menu role="toolbar" class="toolbar" aria-label="toolbar">
        <li class="tool-icon"><button class="primary" (click)="setGridView()">Grid</button></li>
        <li class="tool-icon"><button class="primary" (click)="setListView()">List</button></li>
        <li class="tool-icon"><button class="primary" (click)="toggleSelectMode()">
          {{selectMode() ? 'Exit Select Mode' : 'Select Items'}}
        </button></li>

        @if(selectMode()){
          <li class="tool-icon"><button class="primary" (click)="deleteSelected()">Delete Selected</button></li>
          <li class="tool-icon"><strong>{{this.selectedIds().size}} entires selected</strong></li>
        }@else {
          <li class="tool-icon"><button class="primary" (click)="onAddEntryClick()">New Entry</button></li>
          @if(display() === 'list'){
            <li class="tool-icon">
              <button class="primary" (click)="toggleConfig()">Column Configuartion</button>
              @if(showColumnMenu()){
                <app-columnmenu [table]="table"></app-columnmenu>
              }
              </li>
          }
        }

      </menu>

      @if(loading()){
        <app-loadingcontent></app-loadingcontent>
      }@else if(loanObjectList().length === 0) {
        <app-empty-display ></app-empty-display>
      }@else if (display() === 'grid') {
        <app-grid-item
          [loanObjectList]="loanObjectList()" 
          [selectMode]='selectMode()' 
          [selectedIds]='selectedIds()'
          (toggleSelection)="toggleSelection($event)"
          (deleteLoanItem)="deleteLoanItem($event)"></app-grid-item>
      }@else if (display() ==='list') {
        <app-list-item 
        [loanObjectList]="loanObjectList()"
        [selectMode]="selectMode()"
        [selectedIds]="selectedIds()"
        (toggleSelection)="toggleSelection($event)"
        (deleteLoanItem)="deleteLoanItem($event)"
        [table]="table"
        (toggleAll)="selectAll()"
        [allSelected]="allSelected()"></app-list-item>
      }
    </section>
  `,
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit{
  @Output() addNewEntry = new EventEmitter<void>();

  table = new TableModel<LoanObject>();

  private loanService: LoanService = inject(LoanService);
  loanObjectList = this.loanService.loanObjectList;
  loading = this.loanService.isLoading;

  modalUI: LoanUiService = inject(LoanUiService);//Modal UI signal
  openModal = this.modalUI.modalOpen
  modalMode = this.modalUI.modalMode
  modalData = this.modalUI.targetLoan

  filteredObjectList: LoanObject[]=[]
  display = signal<'list'|'grid'>(localStorage.getItem('viewMode') as 'grid' | 'list' || 'list')

  selectMode = signal(false);
  selectedIds = signal<Set<number>>(new Set());
  allSelected = signal(false);

  showColumnMenu = signal(false);

  ngOnInit(){
    this.table.setColumns([
      {key:'name', label:'Name',visible:true, sortable:true, direction:null},
      {key:'principal', label:'Principal',visible:true, sortable:true, direction:null},
      {key:'interest', label:'Interest',visible:true, sortable:true, direction:null},
      {
        key:'balance',
        label:'Balance',
        visible:true,
        sortable:true,
        direction:null,
        value: (loan) => loan.principal + loan.interest
      },
      {key:'rate', label:'Rate',visible:true, sortable:true, direction:null},
      {key:'minimum', label:'Minimum',visible:true, sortable:true, direction:null},
      {key:'date', label:'Last Payment',visible:true, sortable:true, direction:null}
    ]);

    this.table.setData(this.loanService.loanObjectList());
  }

  constructor() {
    effect(()=>{
      localStorage.setItem('viewMode', this.display());
    })

    effect(() => {
      this.table.setData(this.loanService.loanObjectList());
    })
  }

  setGridView() {
    this.display.set('grid');
  }

  setListView() {
    this.display.set('list');
  }

  toggleSelectMode() {
    this.selectMode.update(v => !v);//flip the boolean
    if(!this.selectMode()) this.selectedIds.set(new Set()); //selectMode is false, reset the selectedIds Set to empty
  }

  toggleConfig() {
    this.showColumnMenu.update(c => !c);
  }

  toggleSelection(id: number) {
    this.selectedIds.update(oldSet => {
      const newSet = new Set(oldSet);//Create a new reference to the updated Set
      if(newSet.has(id)){
        newSet.delete(id);
      }else{
        newSet.add(id);
      }
      return newSet
    })

    if(this.selectedIds().size < this.loanObjectList().length) {
      this.allSelected.set(false);
    }else{
      this.allSelected.set(true);
    }
  }

  selectAll() {
    if(this.allSelected()){
      this.selectedIds.set(new Set())
      this.allSelected.set(false);
    }else{
      this.loanObjectList().map(l => {
        this.selectedIds().add(l.id);
      })
      this.allSelected.set(true);
    }
  }

  deleteSelected() {
    if(this.selectedIds().size === 0) alert("Select Entries To Delete");
    const ids = this.selectedIds();
    this.loanService.deleteMultipleLoans(ids);
    // this.loanObjectList.update(list => list.filter(l => !ids.has(l.id)))
    this.toggleSelectMode();
  }

  async deleteLoanItem(id: number) {
    await this.loanService.deleteLoan(id);
  }

  onAddEntryClick() {
    this.openModal.set(true);
  }
}