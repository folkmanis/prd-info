import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, viewChild } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  TouchedChangeEvent,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { filter } from 'rxjs';
import { JobProductionStage } from 'src/app/interfaces';
import { Files, JobCategories, JobProduct } from 'src/app/jobs/interfaces';
import { ClipboardService } from 'src/app/library/clipboard';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { CustomersService } from 'src/app/services';
import { configuration } from 'src/app/services/config.provider';
import { ReproJobService } from '../../services/repro-job.service';
import { CustomerInputComponent } from '../../customer-input/customer-input.component';
import { ReproProductsEditorComponent } from '../repro-products-editor/repro-products-editor.component';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    CustomerInputComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIcon,
    MatSelectModule,
    MatOptionModule,
    ReproProductsEditorComponent,
    MatCardModule,
  ],
  hostDirectives: [ViewSizeDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: JobFormComponent,
      multi: true,
    },
    { provide: NG_VALIDATORS, useExisting: JobFormComponent, multi: true },
  ],
})
export class JobFormComponent implements ControlValueAccessor, Validator {
  private clipboard = inject(ClipboardService);
  private jobService = inject(ReproJobService);

  private customerInput = viewChild.required(CustomerInputComponent);

  private allJobStates = configuration('jobs', 'jobStates');

  customersEnabled = inject(CustomersService).getCustomerList({ disabled: false });
  jobStates = computed(() => this.allJobStates().filter((st) => st.state < 50));
  categories = configuration('jobs', 'productCategories');

  form = this.createForm();

  jobId = input<number | null>(null);

  customerProducts$ = this.form.controls.customer.valueChanges.pipe(this.jobService.customerProducts());

  writeValue(obj: any): void {
    this.form.reset(obj, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.form.events.pipe(filter((event) => event instanceof TouchedChangeEvent)).subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }

  validate(): ValidationErrors | null {
    if (this.form.valid) {
      return null;
    } else {
      const errors = Object.entries(this.form.controls).reduce(
        (acc, [key, control]) => ({
          ...acc,
          ...(control.invalid ? { [key]: control.errors } : {}),
        }),
        {},
      );
      return errors;
    }
  }

  focusCustomer() {
    this.customerInput().focus();
  }

  copyJobName() {
    return this.clipboard.copySanitized(`${this.jobId()}-${this.form.value.name}`);
  }

  private createForm() {
    const fb = inject(FormBuilder).nonNullable;
    return fb.group({
      customer: ['', [Validators.required]],
      name: ['', [Validators.required]],
      receivedDate: [null as Date, Validators.required],
      dueDate: [null as Date, Validators.required],
      production: fb.group({
        category: [null as JobCategories, Validators.required],
      }),
      comment: [null as string | null],
      customerJobId: [null as string | null],
      jobStatus: fb.group({
        generalStatus: [10],
        timestamp: [null as Date],
      }),
      products: [[] as JobProduct[]],
      files: [null as Files],
      productionStages: [[] as JobProductionStage[]],
    });
  }
}
