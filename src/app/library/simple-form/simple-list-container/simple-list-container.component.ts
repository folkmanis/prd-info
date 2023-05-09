import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ReplaySubject, debounceTime } from 'rxjs';
import { MaterialLibraryModule } from '../../material-library.module';
import { ScrollToTopModule } from '../../scroll-to-top/scroll-to-top.module';
import { ViewSizeModule } from '../../view-size/view-size.module';

@Component({
  selector: 'app-simple-list-container',
  standalone: true,
  templateUrl: './simple-list-container.component.html',
  styleUrls: ['./simple-list-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MaterialLibraryModule,
    ViewSizeModule,
    RouterOutlet,
    ReactiveFormsModule,
    ScrollToTopModule,
  ],
})
export class SimpleListContainerComponent {

  @ViewChild('editor') private routerOutlet: RouterOutlet;

  searchControl = new FormControl<string>('');

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
