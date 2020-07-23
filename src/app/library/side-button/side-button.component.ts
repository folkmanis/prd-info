import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-side-button',
  templateUrl: './side-button.component.html',
  styleUrls: ['./side-button.component.css']
})
export class SideButtonComponent {
  @Input() set opened(param: boolean) {
    this._opened = param;
  }
  get opened(): boolean { return this._opened; }
  private _opened = false;

  @Output() clicks: EventEmitter<void> = new EventEmitter<void>();

}
