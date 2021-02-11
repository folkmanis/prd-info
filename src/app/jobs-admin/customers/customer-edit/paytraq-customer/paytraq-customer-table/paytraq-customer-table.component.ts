import { Component, OnInit, OnDestroy, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { PaytraqClient } from 'src/app/interfaces/paytraq';

@Component({
  selector: 'app-paytraq-customer-table',
  templateUrl: './paytraq-customer-table.component.html',
  styleUrls: ['./paytraq-customer-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaytraqCustomerTableComponent implements OnInit, OnDestroy {

  @Input() set clients(clients: PaytraqClient[]) {
    this.clients$.next(clients || []);
  }

  @Output() clientSelected = new EventEmitter<PaytraqClient>();

  clients$ = new ReplaySubject<PaytraqClient[]>(1);
  displayedColumns: (keyof PaytraqClient)[] = ['clientID', 'name', 'regNumber'];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.clients$.complete();
    this.clientSelected.complete();
  }

}
