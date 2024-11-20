import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import { FormControlStatus } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { ScrollTopDirective } from '../../scroll-to-top/scroll-top.directive';

@Component({
    selector: 'app-simple-form-container',
    templateUrl: './simple-form-container.component.html',
    styleUrls: ['./simple-form-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, ScrollTopDirective, MatToolbarModule, MatIconModule, MatButtonModule],
    providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
    host: {
        '(window:keyup)': 'keyEvent($event)',
    }
})
export class SimpleFormContainerComponent {
  status = input<FormControlStatus>('PENDING');

  isChanges = input(false, { transform: booleanAttribute });

  buttons = input(false, { transform: booleanAttribute });

  save = output();

  reset = output();

  isSaveEnabled = computed(() => this.status() === 'VALID' && !!this.isChanges());

  /** Ctrl-Enter triggers save */
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey && this.isSaveEnabled) {
      event.stopPropagation();
      event.preventDefault();
      this.save.emit();
    }
  }

  onSave() {
    this.save.emit();
  }

  onReset(): void {
    this.reset.emit();
  }
}
