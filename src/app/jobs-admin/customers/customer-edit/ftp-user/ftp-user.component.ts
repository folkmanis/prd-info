import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { defaults } from 'lodash';
import { pluck } from 'rxjs/operators';
import { FtpUserData } from 'src/app/interfaces';
import { JobsApiService } from 'src/app/jobs';

const DEFAULT_DATA: FtpUserData = {
  folder: null,
  username: null,
  password: null,
};

@Component({
  selector: 'app-ftp-user',
  templateUrl: './ftp-user.component.html',
  styleUrls: ['./ftp-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FtpUserComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: FtpUserComponent,
    }
  ]
})
export class FtpUserComponent implements ControlValueAccessor, Validator {

  readonly ftpFolders$ = this.jobsApi.readFtp().pipe(pluck('folders'));

  form = this.fb.group({
    folder: [
      DEFAULT_DATA.folder,
      Validators.required
    ],
    username: DEFAULT_DATA.username,
    password: DEFAULT_DATA.password,
  });

  get folderControl() {
    return this.form.controls.folder;
  }

  onTouchFn: () => void = () => { };

  constructor(
    private fb: FormBuilder,
    private jobsApi: JobsApiService,
  ) { }

  writeValue(obj: FtpUserData): void {
    this.form.setValue(
      defaults(obj, DEFAULT_DATA),
      { emitEvent: false }
    );
  }

  registerOnChange(fn: (data: FtpUserData) => void): void {
    this.form.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
    this.form.updateValueAndValidity();
  }

  validate(): ValidationErrors {
    return this.folderControl.errors;
  }

}
