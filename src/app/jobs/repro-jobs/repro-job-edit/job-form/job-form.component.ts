import { TextFieldModule } from '@angular/cdk/text-field';
import { AsyncPipe, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { addDays, subDays } from 'date-fns';
import { Observable, distinctUntilChanged, filter, map, switchMap } from 'rxjs';
import { CustomerPartial } from 'src/app/interfaces';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { LoginService } from 'src/app/login';
import { CustomersService, ProductsService } from 'src/app/services';
import { getConfig } from 'src/app/services/config.provider';
import { ViewSizeModule } from 'src/app/library/view-size/view-size.module';
import { Job } from '../../../interfaces';
import { JobFormService } from '../../services/job-form.service';
import { CustomerInputComponent } from '../customer-input/customer-input.component';
import { ReproProductsEditorComponent } from '../repro-products-editor/repro-products-editor.component';
import { CopyClipboardDirective } from 'src/app/library/directives/copy-clipboard.directive';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    ViewSizeModule,
    ReactiveFormsModule,
    CustomerInputComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    ReproProductsEditorComponent,
    MatCardModule,
    TextFieldModule,
    AsyncPipe,
    CopyClipboardDirective,
  ],
})
export class JobFormComponent implements OnInit {
  @ViewChild(CustomerInputComponent) customerInput: CustomerInputComponent;

  form = this.formService.form;

  customers$: Observable<CustomerPartial[]> =
    this.customersService.customers$.pipe(
      map((customers) => customers.filter((customer) => !customer.disabled))
    );

  receivedDate = {
    min: subDays(Date.now(), 5),
    max: addDays(Date.now(), 3),
  };

  jobStates$ = getConfig('jobs', 'jobStates').pipe(
    map((states) => states.filter((st) => st.state < 50))
  );

  categories$ = getConfig('jobs', 'productCategories');

  jobIdAndName$ = this.formService.value$.pipe(
    map((job) => this.jobIdAndName(job))
  );

  customerProducts$ = this.formService.value$.pipe(
    map((value) => value.customer),
    filter((customer) => !!customer),
    distinctUntilChanged(),
    switchMap((customer) => this.productsService.productsCustomer(customer))
  );

  showPrices$: Observable<boolean> = this.loginService.isModule('calculations');

  get nameControl() {
    return this.formService.form.controls.name;
  }

  get isNew(): boolean {
    return !this.formService.value.jobId;
  }

  constructor(
    private productsService: ProductsService,
    private customersService: CustomersService,
    private sanitize: SanitizeService,
    private loginService: LoginService,
    private formService: JobFormService
  ) {}

  ngOnInit(): void {}

  private jobIdAndName(job: Partial<Job>) {
    const name = this.sanitize.sanitizeFileName(job.name);
    return `${job.jobId}-${name}`;
  }
}
