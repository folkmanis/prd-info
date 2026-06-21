import { Component, Inject, input, linkedSignal, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatDivider, MatListModule } from '@angular/material/list';
import { firstValueFrom, Observable } from 'rxjs';
import { PaytraqClient } from 'src/app/interfaces/paytraq';
import { updateCatching } from 'src/app/library/update-catching';

export interface PaytraqCustomerSelectDialogData {
  name: string;
  searchFn: (name: string) => Observable<PaytraqClient[]>;
}

@Component({
  selector: 'app-paytraq-customer-select',
  imports: [
    FormsModule,
    MatInput,
    MatIcon,
    MatIconButton,
    MatFormFieldModule,
    MatDialogModule,
    MatButton,
    MatListModule,
    MatDivider,
  ],
  templateUrl: './paytraq-customer-select.component.html',
  styleUrl: './paytraq-customer-select.component.scss',
})
export class PaytraqCustomerSelectComponent {
  protected busy = signal(false);
  #update = updateCatching(this.busy);

  protected name = model(this.data.name);

  protected clients = signal([] as PaytraqClient[]);

  constructor(@Inject(MAT_DIALOG_DATA) private data: PaytraqCustomerSelectDialogData) {}

  async onSearch() {
    this.#update(async () => {
      const result = await firstValueFrom(this.data.searchFn(this.name()));
      this.clients.set(result);
    });
  }
}
