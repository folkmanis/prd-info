import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { disabled, form, FormField, FormRoot, min, required } from '@angular/forms/signals';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { CustomerPartial, ProductPartial } from 'src/app/interfaces';
import { AutocompleteFilterDirective } from 'src/app/library/autocomplete';
import { JobCategories, JobCreate } from '../../interfaces';
import { QuickCreateJob } from '../../interfaces/jobs-user-preferences';
import { QuickCreateService } from '../quick-create.service';

@Component({
  selector: 'app-quick-create-input',
  imports: [
    MatCardModule,
    FormField,
    FormRoot,
    MatFormFieldModule,
    MatInput,
    MatButton,
    MatIconButton,
    MatIcon,
    MatAutocompleteModule,
    MatDatepickerModule,
    AutocompleteFilterDirective,
    CdkTextareaAutosize,
  ],
  templateUrl: './quick-create-input.component.html',
  styleUrl: './quick-create-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickCreateInputComponent {
  #service = inject(QuickCreateService);

  products = input.required<ProductPartial[]>();
  customers = input.required<CustomerPartial[]>();
  initialJob = input.required<QuickCreateJob>();

  updated = output<void>();

  customerNameSelected = output<string | null>();

  protected customerNames = computed(() => this.customers().map((c) => c.CustomerName));

  protected productNames = computed(() => this.products().map((p) => p.name));

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

  #jobModel = linkedSignal(() => {
    const initialJob = this.initialJob();
    return {
      receivedDate: new Date(),
      customer: initialJob.customerName,
      product: initialJob.productName,
      name: '',
      count: NaN,
      comment: '',
    };
  });
  protected jobForm = form(
    this.#jobModel,
    (s) => {
      required(s.receivedDate);

      required(s.customer, { message: `Jānorāda obligāti` });

      required(s.product, { message: `Jānorāda obligāti` });
      disabled(s.product, ({ stateOf }) => stateOf(s.customer).valid() !== true);

      required(s.name, { message: `Jānorāda obligāti` });

      required(s.count, { message: `Jānorāda obligāti` });
      min(s.count, 0);
    },
    {
      submission: {
        action: async (f) => {
          const job = this.#fromModel();
          if (job) {
            await this.#service.saveJob(job);
            this.updated.emit();
            f.name().focusBoundControl();
            f().reset();
            f().value.update((j) => ({ ...j, name: '', count: NaN, comment: '' }));
          }
        },
      },
    },
  );

  constructor() {
    effect(() => {
      this.customerNameSelected.emit(this.#customerName() || null);
    });
  }

  protected jobNameEnter() {
    if (this.jobForm.name().valid()) {
      this.jobForm.count().focusBoundControl();
    }
  }

  #fromModel(): JobCreate | null {
    const cProduct = this.#customerProduct();
    if (!cProduct) {
      return null;
    }

    const m = this.#jobModel();

    return {
      customer: m.customer,
      name: `Plates ${m.name}`,
      customerJobId: m.name,
      receivedDate: m.receivedDate,
      dueDate: m.receivedDate,
      comment: m.comment,
      products: [
        {
          name: cProduct.productName,
          units: cProduct.units,
          comment: '',
          count: m.count,
          price: m.count * (cProduct.price ?? 0),
        },
      ],
      jobStatus: {
        generalStatus: 30,
        timestamp: new Date(),
      },
      production: {
        category: cProduct.category as JobCategories,
      },
      productionStages: [],
    };
  }
}
