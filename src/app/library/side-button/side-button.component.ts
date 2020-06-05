import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-side-button',
  templateUrl: './side-button.component.html',
  styleUrls: ['./side-button.component.css']
})
export class SideButtonComponent implements OnInit {
  @Input() set opened(param: boolean) {
    this._opened = param;
  }
  @Output() clicks: EventEmitter<void> = new EventEmitter<void>();

  _opened = false;

  constructor() { }

  ngOnInit(): void {
  }

}
