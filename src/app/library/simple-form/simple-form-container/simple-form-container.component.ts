import { ChangeDetectionStrategy, Component, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FormControlStatus, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { ScrollToTopModule } from '../../scroll-to-top/scroll-to-top.module';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MaterialLibraryModule } from '../../material-library.module';

@Component({
  selector: 'app-simple-form-container',
  standalone: true,
  templateUrl: './simple-form-container.component.html',
  styleUrls: ['./simple-form-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MaterialLibraryModule,
    ScrollToTopModule,
    RouterLink,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ]
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
