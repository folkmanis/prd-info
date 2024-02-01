import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Colors, VeikalsKaste } from 'src/app/kastes/interfaces';
import { HideZeroPipe } from '../../../library/common/hide-zero.pipe';

export interface Status {
  type: 'empty' | 'kaste' | 'none';
  kaste?: VeikalsKaste;
}

export class NoopErrorStateMatcher implements ErrorStateMatcher {
  isErrorState = () => false;
}

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ErrorStateMatcher, useClass: NoopErrorStateMatcher }],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    HideZeroPipe,
  ],
})
export class LabelsComponent {
  @ViewChild('kodsInput') kodsInput: ElementRef<HTMLInputElement>;

  @Input() set status(status: Status) {
    if (!status) {
      return;
    }
    this._status = status;
    this.kodsControl.enable();
    this.kodsInput?.nativeElement.focus();
    this.kodsInput?.nativeElement.select();
    if (status.type === 'none') {
      this.kodsControl.reset(undefined, { emitEvent: false });
    }
  }
  get status(): Status {
    return this._status;
  }
  private _status: Status = { type: 'none' };

  @Input() colors: { [key in Colors]: string } | undefined;

  @Output() code = new EventEmitter<number>();

  kodsControl = new FormControl('', {
    validators: [Validators.required],
  });

  onLabelSubmit(): void {
    this.kodsControl.disable();
    this.code.next(+this.kodsControl.value);
  }
}
