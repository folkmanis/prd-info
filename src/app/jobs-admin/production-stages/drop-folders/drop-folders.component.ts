import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ClassTransformer } from 'class-transformer';
import { isEqual } from 'lodash-es';
import { map, Observable, shareReplay } from 'rxjs';
import { FileElement, JobFilesService } from 'src/app/filesystem';
import { CustomerPartial, DropFolder } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services/customers.service';

type DropFolderForm = FormGroup<{
  path: FormControl<string[]>;
  customers: FormControl<string[]>;
}>;


@Component({
  selector: 'app-drop-folders',
  templateUrl: './drop-folders.component.html',
  styleUrls: ['./drop-folders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    }
  ]
})
export class DropFoldersComponent implements OnInit, ControlValueAccessor, Validator {

  form = new FormArray<DropFolderForm>(
    [],
    {
      validators: [this.duplicateDefaultValidator()]
    }
  );

  dropFolders$: Observable<{ value: string[], name: string; }[]> = this.filesService.dropFolders().pipe(
    map(dropFolderNames),
    shareReplay(1),
  );

  customers$: Observable<CustomerPartial[]> = this.customersService.customers$;

  touchFn: () => void = () => { };

  pathCompare: (o1: string[], o2: string[]) => boolean = isEqual;

  constructor(
    private transformer: ClassTransformer,
    private chDetector: ChangeDetectorRef,
    private filesService: JobFilesService,
    private customersService: CustomersService,
  ) { }

  writeValue(obj: DropFolder[]): void {
    obj = Array.isArray(obj) ? obj : [];
    if (this.form.length === obj.length) {
      this.form.setValue(obj, { emitEvent: false });
    } else {
      this.form.clear({ emitEvent: false });
      obj.forEach(o => this.form.push(this.dropFolderForm(o), { emitEvent: false }));
    }
    this.chDetector.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.pipe(
      map(value => this.transformer.plainToInstance(DropFolder, value))
    ).subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.touchFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  validate(): ValidationErrors {
    return this.form.valid ? null : { dropFolders: this.folderErrors };
  }

  ngOnInit(): void {

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
    return this.form.controls.filter(c => !c.valid).map(c => c.errors);
  }

  private dropFolderForm(value: DropFolder): DropFolderForm {
    return new FormGroup({
      path: new FormControl<string[]>(
        value.path,
        {
          validators: [Validators.required],
        }
      ),
      customers: new FormControl<string[]>(
        value.customers || [],
        {
          validators: [Validators.required],
        }
      ),
    });
  }

  private duplicateDefaultValidator(): ValidatorFn {
    return (control: FormArray<DropFolderForm>) => {
      const defaults = control.value?.filter(val => val.customers?.includes('**'));
      return defaults.length > 1 ? { duplicateDefaults: defaults } : null;
    };
  }

}

function dropFolderNames(elements: FileElement[]): { value: string[], name: string; }[] {
  return elements
    .filter(el => el.isFolder)
    .map(el => ({
      value: [...el.parent, el.name],
      name: [...el.parent, el.name].join('/'),
    }));
}