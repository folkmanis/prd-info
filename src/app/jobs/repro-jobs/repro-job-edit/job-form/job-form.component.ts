import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { addDays, subDays } from 'date-fns';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { CopyClipboardDirective } from 'src/app/library/directives/copy-clipboard.directive';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { LoginService } from 'src/app/login';
import { CustomersService, ProductsService } from 'src/app/services';
import { configuration } from 'src/app/services/config.provider';
import { JobFormService } from '../../services/job-form.service';
import { CustomerInputComponent } from '../customer-input/customer-input.component';
import { ReproProductsEditorComponent } from '../repro-products-editor/repro-products-editor.component';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ViewSizeDirective,
    CustomerInputComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIcon,
    MatSelectModule,
    MatOptionModule,
    ReproProductsEditorComponent,
    CopyClipboardDirective,
  ],
  hostDirectives: [ViewSizeDirective],
})
export class JobFormComponent {
  private sanitize = inject(SanitizeService);
  private formService = inject(JobFormService);

  private customerInput = viewChild.required(CustomerInputComponent);

  private allJobStates = configuration('jobs', 'jobStates');

  customersEnabled = inject(CustomersService).customersEnabled;

  form = this.formService.form;

  receivedDate = {
    min: subDays(Date.now(), 5),
    max: addDays(Date.now(), 3),
  };

  jobStates = computed(() => this.allJobStates().filter((st) => st.state < 50));

  categories = configuration('jobs', 'productCategories');

  jobIdAndName = computed(() => {
    const job = this.formService.value();
    const name = this.sanitize.sanitizeFileName(job.name);
    return `${job.jobId}-${name}`;
  });

  get nameControl() {
    return this.formService.form.controls.name;
  }

  focusCustomer() {
    this.customerInput().focus();
  }
}
