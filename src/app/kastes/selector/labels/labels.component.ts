import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { pluck } from 'rxjs/operators';
import { Kaste } from 'src/app/interfaces';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';

export interface Status {
  type: 'empty' | 'kaste' | 'none';
  kaste?: Kaste;
}

export class NoopErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(): boolean {
    return false;
  }
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
  @ViewChild('kodsInput') kodsInput: ElementRef;

  @Input() set status(status: Status) {
    this.inputForm.reset();
    this.inputForm.enable();
    this.kodsInput?.nativeElement.focus();
    if (!status) {
      this._status = { type: 'none' };
      return;
    }
    this._status = status;
  }
  get status(): Status {
    return this._status;
  }
  private _status: Status = { type: 'none' };

  @Output() code = new EventEmitter<string | number>();

  inputForm = new FormGroup({
    kods: new FormControl(
      '',
      {
        validators: [Validators.required]
      }
    ),
  });

  constructor(
    private kastesPreferencesService: KastesPreferencesService,
  ) { }

  colors$ = this.kastesPreferencesService.preferences$.pipe(
    pluck('colors'),
  );

  ngOnInit() {
  }

  onLabelSubmit({ kods }: { kods: string; }): void {
    this.inputForm.disable();
    this.code.emit(kods);
  }

}
