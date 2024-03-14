import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { PaytraqClient } from 'src/app/interfaces/paytraq';

@Component({
  selector: 'app-paytraq-customer-table',
  standalone: true,
  templateUrl: './paytraq-customer-table.component.html',
  styleUrls: ['./paytraq-customer-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
  ]
})
export class PaytraqCustomerTableComponent {

  clients = input<PaytraqClient[]>([]);

  clientSelected = output<PaytraqClient>();

  displayedColumns: (keyof PaytraqClient)[] = ['clientID', 'name', 'regNumber'];

  onSelected(client: PaytraqClient) {
    this.clientSelected.emit(client);
  }

}
