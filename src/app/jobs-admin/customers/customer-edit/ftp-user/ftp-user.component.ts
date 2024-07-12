import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  TouchedChangeEvent,
  Validators,
  ValueChangeEvent
} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { plainToInstance } from 'class-transformer';
import { filter, map } from 'rxjs';
import { JobFilesService } from 'src/app/filesystem';
import { FtpUserData } from 'src/app/interfaces';

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
  ],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
  ],
})
export class FtpUserComponent implements ControlValueAccessor {

  private filesApi = inject(JobFilesService);

  ftpFolders = signal([] as string[]);

  form = inject(FormBuilder).group({
    folder: [null as string | null, [Validators.required]],
    username: [null as string | null],
    password: [null as string | null],
  });

  get folderControl() {
    return this.form.controls.folder;
  }

  onTouchFn: () => void = () => { };

  constructor() {
    this.getFtpFolders();
    this.form.events.pipe(
      filter(event => event instanceof TouchedChangeEvent && event.touched === true)
    ).subscribe(() => this.onTouchFn());
  }

  writeValue(obj: FtpUserData | null): void {
    this.getFtpFolders();
    this.form.reset(obj, { emitEvent: false });
  }

  registerOnChange(fn: (data: FtpUserData | null) => void): void {
    this.form.events.pipe(
      filter(event => event instanceof ValueChangeEvent),
      map(({ source, value }: ValueChangeEvent<FtpUserData>) => source.valid ? plainToInstance(FtpUserData, value) : null)
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

  private async getFtpFolders() {
    const folders = (await this.filesApi.ftpFolders())
      .filter(element => element.isFolder)
      .map(element => element.name);
    this.ftpFolders.set(folders);
  }

  private folderValidator;
}
