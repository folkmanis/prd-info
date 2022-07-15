import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { defaults } from 'lodash';
import { map, pluck, from, toArray, Observable, switchMap, filter } from 'rxjs';
import { FtpUserData } from 'src/app/interfaces';
import { plainToInstance } from 'class-transformer';
import { JobsFilesApiService } from 'src/app/filesystem';

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

  readonly ftpFolders$: Observable<string[]> = this.filesApi.readFtp().pipe(
    switchMap(elements => from(elements)),
    filter(element => element.isFolder),
    pluck('name'),
    toArray(),
  );

  form = new FormGroup({
    folder: new FormControl(
      DEFAULT_DATA.folder,
      [Validators.required],
    ),
    username: new FormControl(DEFAULT_DATA.username),
    password: new FormControl(DEFAULT_DATA.password),
  });

  get folderControl() {
    return this.form.controls.folder;
  }

  onTouchFn: () => void = () => { };

  constructor(
    private filesApi: JobsFilesApiService,
  ) { }

  writeValue(obj: FtpUserData): void {
    this.form.setValue(
      defaults(obj, DEFAULT_DATA),
      { emitEvent: false }
    );
  }

  registerOnChange(fn: (data: FtpUserData) => void): void {
    this.form.valueChanges.pipe(
      map(value => plainToInstance(FtpUserData, value)),
    ).subscribe(fn);
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
  }

  validate(): ValidationErrors {
    return this.folderControl.errors;
  }

}
