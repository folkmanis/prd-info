import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { Job, JobCreate, JobStatus } from '../../interfaces';
import { CustomerPartial, ProductPartial } from 'src/app/interfaces';
import { QuickCreateService } from '../quick-create.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AutocompleteFilterDirective } from './autocomplete-filter.directive';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-quick-create-input',
  imports: [
    MatCardModule,
    FormField,
    MatFormFieldModule,
    MatInput,
    MatButton,
    MatIconButton,
    MatIcon,
    MatAutocompleteModule,
    MatDatepickerModule,
    AutocompleteFilterDirective,
  ],
  templateUrl: './quick-create-input.component.html',
  styleUrl: './quick-create-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickCreateInputComponent {
  #service = inject(QuickCreateService);

  products = input.required<ProductPartial[]>();
  customers = input.required<CustomerPartial[]>();

  #customerName = computed(() => {
    const name = this.#jobModel().customer?.toUpperCase();
    return this.customers().find((c) => c.CustomerName.toUpperCase() === name)?.CustomerName;
  });

  #productsCustomer = this.#service.productsCustomerResource(this.#customerName);
  #customerProduct = computed(() => {
    if (this.#productsCustomer.hasValue() === false || this.#product.hasValue() === false) {
      return undefined;
    }
    const product = this.#product.value();
    return this.#productsCustomer.value().find((p) => p.productName === product.name);
  });

  #productId = computed(() => {
    const name = this.#jobModel().product?.toUpperCase();
    return this.products().find((p) => p.name.toUpperCase() === name)?._id;
  });

  #product = this.#service.productResource(this.#productId);

  #jobModel = signal({
    customer: '',
    name: '',
    count: NaN,
    receivedDate: new Date(),
    comment: '',
    product: '',
  });
  protected jobForm = form(this.#jobModel, (s) => {
    required(s.customer);
    required(s.name);
    required(s.count);
    required(s.receivedDate);
    required(s.product);
  });

  protected customerOptions = computed(() => this.customers().map((c) => c.CustomerName));

  protected productOptions = computed(() => this.products().map((p) => p.name));

  jobCreate = output<JobCreate>();

  onSubmit() {
    submit(this.jobForm, async (s) => {
      if (s().valid() === false) {
        return;
      }
      const job = this.#fromModel();
      if (job) {
        this.jobCreate.emit(job);
        this.jobForm().reset();
        this.#jobModel.update((j) => ({ ...j, name: '', count: NaN, comment: '' }));
        this.jobForm.name().focusBoundControl();
      }
    });
  }

  #fromModel(): JobCreate | null {
    if (this.#product.hasValue() === false) {
      return null;
    }
    const product = this.#product.value();
    const cProduct = this.#customerProduct();

    const m = this.#jobModel();

    return {
      customer: m.customer,
      name: `Plates ${m.name}`,
      customerJobId: m.name,
      receivedDate: m.receivedDate,
      dueDate: m.receivedDate,
      comment: m.comment || null,
      invoiceId: null,
      products: [
        {
          name: product.name,
          units: product.units,
          comment: null,
          count: m.count,
          price: m.count * (cProduct?.price ?? 0),
        },
      ],
      jobStatus: {
        generalStatus: 40,
        timestamp: new Date(),
      },
      files: null,
      production: {
        category: 'repro',
      },
      productionStages: [],
    };
  }
}
