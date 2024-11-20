import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, TemplateRef, booleanAttribute, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { ViewSizeDirective } from 'src/app/library/view-size';

@Component({
    selector: 'app-simple-list-container',
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
    ]
})
export class SimpleListContainerComponent {
  filterTemplate: TemplateRef<any> | null = null;

  editorWidth = input('50%');

  hideFilterWhenActive = input(false, { transform: booleanAttribute });

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

  activeStatus = signal(false);

  onActivate(): void {
    this.activeStatus.set(true);
  }

  onDeactivate(): void {
    this.activeStatus.set(false);
  }
}
