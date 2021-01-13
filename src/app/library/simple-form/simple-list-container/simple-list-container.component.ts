import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Input, OnDestroy, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { IFormControl } from '@rxweb/types';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-simple-list-container',
  templateUrl: './simple-list-container.component.html',
  styleUrls: ['./simple-list-container.component.scss'],
})
export class SimpleListContainerComponent implements OnDestroy {
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

  ngOnDestroy(): void {
    this.activeStatusChanges.complete();
  }

  onActivate(): void {
    this.activeStatusChanges.next(this.isActivated);
  }

}
