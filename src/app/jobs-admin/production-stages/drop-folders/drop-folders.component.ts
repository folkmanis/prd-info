import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { isEqual } from 'lodash-es';
import { map } from 'rxjs';
import { CustomerPartial, DropFolder } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';

type DropFolderForm = FormGroup<{
  path: FormControl<string[]>;
  customers: FormControl<string[]>;
}>;

@Component({
  selector: 'app-drop-folders',
  templateUrl: './drop-folders.component.html',
  styleUrls: ['./drop-folders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormsModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatOptionModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DropFoldersComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: DropFoldersComponent,
      multi: true,
    },
  ],
})
export class DropFoldersComponent implements ControlValueAccessor, Validator {
  private transformer = inject(AppClassTransformerService);
  private chDetector = inject(ChangeDetectorRef);

  dropFolders = input.required<{ value: string[]; name: string }[]>();

  customers = input.required<CustomerPartial[]>();

  form = new FormArray<DropFolderForm>([], {
    validators: [this.duplicateDefaultValidator()],
  });

  touchFn: () => void = () => {};

  pathCompare: (o1: string[], o2: string[]) => boolean = isEqual;

  writeValue(obj: DropFolder[]): void {
    obj = Array.isArray(obj) ? obj : [];
    if (this.form.length === obj.length) {
      this.form.setValue(obj, { emitEvent: false });
    } else {
      this.form.clear({ emitEvent: false });
      obj.forEach((o) => this.form.push(this.dropFolderForm(o), { emitEvent: false }));
    }
    this.chDetector.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.pipe(map((value) => this.transformer.plainToInstance(DropFolder, value))).subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.touchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }

  validate(): ValidationErrors {
    return this.form.valid ? null : { dropFolders: this.folderErrors };
  }

  onCustomerSelection({ value, source }: MatSelectChange): void {
    if (Array.isArray(value) && value.includes('**')) {
      source.value = ['**'];
    }
  }

  append() {
    this.form.push(this.dropFolderForm(new DropFolder()));
    this.chDetector.markForCheck();
  }

  delete(idx: number) {
    this.form.removeAt(idx);
    this.chDetector.markForCheck();
  }

  private folderErrors() {
    return this.form.controls.filter((c) => !c.valid).map((c) => c.errors);
  }

  private dropFolderForm(value: DropFolder): DropFolderForm {
    return new FormGroup({
      path: new FormControl<string[]>(value.path, {
        validators: [Validators.required],
      }),
      customers: new FormControl<string[]>(value.customers || [], {
        validators: [Validators.required],
      }),
    });
  }

  private duplicateDefaultValidator(): ValidatorFn {
    return (control: FormArray<DropFolderForm>) => {
      const defaults = control.value?.filter((val) => val.customers?.includes('**'));
      return defaults.length > 1 ? { duplicateDefaults: defaults } : null;
    };
  }
}
