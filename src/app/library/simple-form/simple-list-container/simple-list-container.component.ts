import { Component, OnInit, Input, Output, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IFormControl } from '@rxweb/types';
import { FormControl } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-simple-list-container',
  templateUrl: './simple-list-container.component.html',
  styleUrls: ['./simple-list-container.component.scss'],
})
export class SimpleListContainerComponent implements OnInit {
  @ViewChild('editor') private routerOutlet: RouterOutlet;

  searchControl: IFormControl<string> = new FormControl('');

  filterTemplate: TemplateRef<any> | null = null;

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
    this.filterTemplate = val instanceof TemplateRef ? val : null;
  }
  get filterInput() { return this._filterInput; }
  private _filterInput = false;

  @Output() filter = this.searchControl.valueChanges;

  @Output() activeStatusChanges = new Subject<boolean>();

  get isActivated(): boolean {
    return this.routerOutlet?.isActivated || false;
  }

  constructor() { }

  ngOnInit(): void {
  }

  onActivate(): void {
    this.activeStatusChanges.next(this.isActivated);
  }

}
