import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ReplaySubject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-simple-list-typed-container',
  templateUrl: './simple-list-typed-container.component.html',
  styleUrls: ['./simple-list-typed-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleListTypedContainerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editor') private routerOutlet: RouterOutlet;

  searchControl = new FormControl<string>('');

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
