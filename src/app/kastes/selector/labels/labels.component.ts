import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { pluck } from 'rxjs/operators';
import { Kaste, Colors } from 'src/app/interfaces';

export interface Status {
  type: 'empty' | 'kaste' | 'none';
  kaste?: Kaste;
}

export class NoopErrorStateMatcher implements ErrorStateMatcher {
  isErrorState = () => false;
}

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss'],
  providers: [
    { provide: ErrorStateMatcher, useClass: NoopErrorStateMatcher },
  ]
})
export class LabelsComponent implements OnInit {
  @ViewChild('kodsInput') kodsInput: ElementRef<HTMLInputElement>;

  @Input() set status(status: Status) {
    if (!status) { return; }
    this._status = status;
    this.inputForm.enable();
    this.kodsInput?.nativeElement.focus();
    this.kodsInput?.nativeElement.select();
    if (status.type === 'none') { this.inputForm.reset(undefined, { emitEvent: false }); }
  }
  get status(): Status {
    return this._status;
  }
  private _status: Status = { type: 'none' };

  @Input() colors: { [key in Colors]: string } | undefined;

  @Output() code = new EventEmitter<string | number>();

  inputForm = new FormGroup({
    kods: new FormControl(
      '',
      {
        validators: [Validators.required]
      }
    ),
  });

  constructor() { }

  ngOnInit() {
  }

  onLabelSubmit({ kods }: { kods: string }): void {
    this.inputForm.disable();
    this.code.emit(kods);
  }

}
