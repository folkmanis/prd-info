import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { FormControlStatus } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { ScrollTopDirective } from '../../scroll-to-top/scroll-top.directive';

@Component({
  selector: 'app-simple-form-container',
  standalone: true,
  templateUrl: './simple-form-container.component.html',
  styleUrls: ['./simple-form-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ScrollTopDirective,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class SimpleFormContainerComponent {
  private _status: FormControlStatus = 'PENDING';
  @Input() set status(value: FormControlStatus) {
    this._status = value || 'PENDING';
  }
  get status(): FormControlStatus {
    return this._status;
  }

  private _isChanges = false;
  @Input() set isChanges(value: any) {
    this._isChanges = coerceBooleanProperty(value);
  }
  get isChanges(): boolean {
    return this._isChanges;
  }

  private _buttons = false;
  @Input()
  set buttons(value: any) {
    this._buttons = coerceBooleanProperty(value);
  }
  get buttons() {
    return this._buttons;
  }

  @Output('save') save$ = new Subject<void>();

  @Output('reset') reset$ = new Subject<void>();

  get isSaveEnabled(): boolean {
    return this.status === 'VALID' && !!this.isChanges;
  }

  /** Ctrl-Enter triggers save */
  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey && this.isSaveEnabled) {
      event.stopPropagation();
      event.preventDefault();
      this.save$.next();
    }
  }

  onSave() {
    this.save$.next();
  }

  onReset(): void {
    this.reset$.next();
  }
}
