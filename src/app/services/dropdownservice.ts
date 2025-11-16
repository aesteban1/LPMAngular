import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Dropdownservice {
  activeDropdownId = signal<string |null>(null);

  open(id: string) {
    this.activeDropdownId.set(id);
  }

  close() {
    this.activeDropdownId.set(null);
  }

  isOpen(id: string): boolean {
    return this.activeDropdownId() === id;
  }
}
