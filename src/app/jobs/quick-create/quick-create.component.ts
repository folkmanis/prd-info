import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { QuickCreateInputComponent } from './quick-create-input/quick-create-input.component';
import { CustomerPartial, ProductPartial } from 'src/app/interfaces';
import { JobCreate } from '../interfaces';

@Component({
  selector: 'app-quick-create',
  imports: [QuickCreateInputComponent],
  templateUrl: './quick-create.component.html',
  styleUrl: './quick-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickCreateComponent {
  products = input.required<ProductPartial[]>();
  customers = input.required<CustomerPartial[]>();

  onJobCreate(job: JobCreate) {
    console.log(job);
  }
}
