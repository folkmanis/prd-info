import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import { FormControlStatus } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { SimpleContentContainerComponent } from '../simple-content-container/simple-content-container.component';

@Component({
  selector: 'app-simple-form-container',
  templateUrl: './simple-form-container.component.html',
  styleUrls: ['./simple-form-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, SimpleContentContainerComponent],
  providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
  host: {
    '(window:keyup)': 'keyEvent($event)',
  },
})
export class SimpleFormContainerComponent {
  status = input<FormControlStatus>('PENDING');

  isChanges = input(false, { transform: booleanAttribute });

  buttons = input(false, { transform: booleanAttribute });

  save = output();

  resetForm = output();

  isSaveEnabled = computed(() => this.status() === 'VALID' && !!this.isChanges());

  /** Ctrl-Enter triggers save */
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey && this.isSaveEnabled()) {
      event.stopPropagation();
      event.preventDefault();
      this.save.emit();
    }
  }

  onSave() {
    this.save.emit();
  }

  onReset(): void {
    this.resetForm.emit();
  }
}
