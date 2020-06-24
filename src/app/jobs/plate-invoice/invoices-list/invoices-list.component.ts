import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Invoice } from 'src/app/interfaces';
import { InvoicesListDatasource } from './invoices-list-datasource';
import { InvoicesService } from '../../services/invoices.service';
import { InvoicesState, InvoiceTable } from '../../store/invoices.state';
import * as InvoicesActions from '../../store/invoices.actions';
import { Observable } from 'rxjs';

const COLUMNS = ['invoiceId', 'customer', 'createdDateString', 'totalAll'];

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.css']
})
export class InvoicesListComponent implements OnInit {

  constructor(
    private store: Store,
  ) { }
  displayedColumns: string[] = COLUMNS;
  @Select(InvoicesState.invoices) datasource$: Observable<InvoiceTable[]>;

  ngOnInit(): void {
    this.store.dispatch(new InvoicesActions.SetInvoicesFilter({}));
  }

}
