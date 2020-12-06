import { Component, OnInit, Input, Output } from '@angular/core';
import { IFormControl } from '@rxweb/types';
import { FormControl } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-simple-list-container',
  templateUrl: './simple-list-container.component.html',
  styleUrls: ['./simple-list-container.component.scss']
})
export class SimpleListContainerComponent implements OnInit {

  searchControl: IFormControl<string> = new FormControl('');

  @Input() large = true;

  @Input() editorWidth = '50%';

  @Input()
  set plusButton(val: any) {
    this._plusButton = coerceBooleanProperty(val);
  }
  get plusButton() { return this._plusButton; }
  private _plusButton = false;

  @Input()
  set filterInput(val: any) {
    this._filterInput = coerceBooleanProperty(val);
  }
  get filterInput() { return this._filterInput; }
  private _filterInput = false;

  @Output() filter = this.searchControl.valueChanges;

  constructor() { }


  ngOnInit(): void {
  }

}
