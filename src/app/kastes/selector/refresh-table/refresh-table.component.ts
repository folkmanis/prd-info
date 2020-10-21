import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-refresh-table',
  templateUrl: './refresh-table.component.html',
  styleUrls: ['./refresh-table.component.scss']
})
export class RefreshTableComponent {

  @Output() reload = new EventEmitter();

  constructor(
  ) { }


}
