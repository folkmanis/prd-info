import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { plainToInstance } from 'class-transformer';
import { defaults } from 'lodash-es';
import { Observable, filter, from, map, switchMap, toArray } from 'rxjs';
import { JobsFilesApiService } from 'src/app/filesystem';
import { FtpUserData } from 'src/app/interfaces';

const DEFAULT_DATA: FtpUserData = {
  folder: null,
  username: null,
  password: null,
};

@Component({
  selector: 'app-ftp-user',
  standalone: true,
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
    },
  ],
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
  ],
})
export class FtpUserComponent implements ControlValueAccessor, Validator {
  readonly ftpFolders$: Observable<string[]> = this.filesApi.readFtp().pipe(
    switchMap((elements) => from(elements)),
    filter((element) => element.isFolder),
    map((el) => el.name),
    toArray()
  );

  private _required = false;
  @Input() set required(value: any) {
    this._required = coerceBooleanProperty(value);
    this._onChange();
  }
  get required(): boolean {
    return this._required;
  }

  form = new FormGroup({
    folder: new FormControl(DEFAULT_DATA.folder, [Validators.required]),
    username: new FormControl(DEFAULT_DATA.username),
    password: new FormControl(DEFAULT_DATA.password),
  });

  get folderControl() {
    return this.form.controls.folder;
  }

  onTouchFn: () => void = () => { };
  private _onChange: () => void = () => { };

  constructor(private filesApi: JobsFilesApiService) {
    this.form.events.subscribe((event) => console.log(event));
  }

  writeValue(obj: FtpUserData): void {
    this.form.setValue(defaults(obj, DEFAULT_DATA), { emitEvent: false });
  }

  registerOnChange(fn: (data: FtpUserData) => void): void {
    this.form.valueChanges
      .pipe(map((value) => plainToInstance(FtpUserData, value)))
      .subscribe(fn);
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
    return this.required ? this.folderControl.errors : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }
}
