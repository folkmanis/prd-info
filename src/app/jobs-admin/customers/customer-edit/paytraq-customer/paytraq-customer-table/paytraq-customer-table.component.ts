import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ReplaySubject } from 'rxjs';
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
export class PaytraqCustomerTableComponent implements OnDestroy {

  @Input() set clients(clients: PaytraqClient[]) {
    this.clients$.next(clients || []);
  }

  @Output() clientSelected = new EventEmitter<PaytraqClient>();

  clients$ = new ReplaySubject<PaytraqClient[]>(1);
  displayedColumns: (keyof PaytraqClient)[] = ['clientID', 'name', 'regNumber'];

  ngOnDestroy() {
    this.clients$.complete();
    this.clientSelected.complete();
  }

}
