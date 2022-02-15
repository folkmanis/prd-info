import { Input, Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import {
  FormControl, FormGroup, ControlValueAccessor, Validator, FormBuilder,
  AbstractControl, ValidationErrors, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators,
  ValidatorFn, AsyncValidator, AsyncValidatorFn, NG_ASYNC_VALIDATORS
} from '@angular/forms';
import { FtpUserData } from 'src/app/interfaces';
import { JobsApiService } from 'src/app/jobs';
import { Observable } from 'rxjs';
import { map, pluck, shareReplay, take } from 'rxjs/operators';
import { log } from 'prd-cdk';

const DEFAULT_DATA: FtpUserData = {
  folder: '',
  username: '',
  password: '',
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
      provide: NG_ASYNC_VALIDATORS,
      multi: true,
      useExisting: FtpUserComponent,
    }
  ]
})
export class FtpUserComponent implements OnInit, ControlValueAccessor, AsyncValidator {

  readonly ftpFolders$ = this.jobsApi.readFtp().pipe(
    pluck('folders'),
    shareReplay(1)
  );

  form = this.fb.group({
    folder: [
      DEFAULT_DATA.folder,
      [
        Validators.required,
      ],
      [
        this.folderValidator(),
      ]
    ],
    username: [DEFAULT_DATA.username],
    password: [DEFAULT_DATA.password],
  });

  get folderControl() { return this.form.get('folder') as FormControl; }

  onTouchFn: () => void = () => { };

  constructor(
    private fb: FormBuilder,
    private jobsApi: JobsApiService,
    private chDetector: ChangeDetectorRef,
  ) { }

  writeValue(obj: FtpUserData): void {
    this.form.setValue(
      {
        ...DEFAULT_DATA,
        ...obj,
      },
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
    this.chDetector.markForCheck();
  }

  validate(): Observable<ValidationErrors> {
    const validator = this.folderValidator();
    return validator(this.folderControl);
  }

  ngOnInit(): void {
  }

  private folderValidator(): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return control =>
      this.ftpFolders$.pipe(
        take(1),
        map(folders => folders.includes(control.value) ? null : { nonExist: control.value })
      );
  }

}
