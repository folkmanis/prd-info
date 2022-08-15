import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Input, OnDestroy, Output, TemplateRef, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { IFormControl } from '@rxweb/types';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-simple-list-container',
  templateUrl: './simple-list-container.component.html',
  styleUrls: ['./simple-list-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleListContainerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editor') private routerOutlet: RouterOutlet;

  searchControl: IFormControl<string> = new UntypedFormControl('');

  filterTemplate: TemplateRef<any> | null = null;

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

  @Output() filter = this.searchControl.valueChanges.pipe(
    debounceTime(200),
  );

  @Output() activeStatusChanges = new ReplaySubject<boolean>(1);

  get isActivated(): boolean {
    return this.routerOutlet?.isActivated || false;
  }

  constructor() { }

  ngAfterViewInit() {
    this.activeStatusChanges.next(this.isActivated);
  }

  ngOnDestroy(): void {
    this.activeStatusChanges.complete();
  }

  onActivate(): void {
    this.activeStatusChanges.next(this.isActivated);
  }

}
