import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  TemplateRef,
  booleanAttribute,
  input,
  model,
  viewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { ViewSizeDirective } from 'src/app/library/view-size';

@Component({
  selector: 'app-simple-list-container',
  standalone: true,
  templateUrl: './simple-list-container.component.html',
  styleUrls: ['./simple-list-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    RouterOutlet,
    ScrollTopDirective,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    ViewSizeDirective,
    NgTemplateOutlet,
  ],
})
export class SimpleListContainerComponent {
  private routerOutlet = viewChild<RouterOutlet>('editor');

  filterTemplate: TemplateRef<any> | null = null;

  @Input() editorWidth = '50%';

  plusButton = input(false, { transform: booleanAttribute });

  @Input()
  set filterInput(val: any) {
    this._filterInput = booleanAttribute(val);
    this.filterTemplate = val instanceof TemplateRef ? val : null;
  }
  get filterInput() {
    return this._filterInput;
  }
  private _filterInput = false;

  filter = model('');

  @Output() activeStatusChanges = new ReplaySubject<boolean>(1);

  get isActivated(): boolean {
    return this.routerOutlet()?.isActivated || false;
  }

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
