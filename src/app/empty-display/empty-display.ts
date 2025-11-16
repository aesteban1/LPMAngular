import { Component } from '@angular/core';

@Component({
  selector: 'app-empty-display',
  imports: [],
  standalone:true,
  template: `
      <img class="empty" src="assets/emptyIcon.svg" alt="Empty List Icon" aria-hidden="true">
      <p><strong>No Entries To Display</strong></p>
      <button class="primary">Add Entry</button>
  `,
  styleUrls: ['./empty-display.scss']
})
export class EmptyDisplay {
  imageSrc = 'assets/emptyIcon.svg';
}