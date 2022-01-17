import { Component, OnInit } from '@angular/core';
import { Invoice } from 'src/app/interfaces';
import { InvoicesListDatasource } from './invoices-list-datasource';
import { InvoicesService } from '../../services/invoices.service';

const COLUMNS = ['invoiceId', 'customer', 'createdDate', 'totalSum'];

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.scss']
})
export class InvoicesListComponent implements OnInit {

  datasource = new InvoicesListDatasource(this.service);
  displayedColumns: string[] = COLUMNS;

  constructor(
    private service: InvoicesService,
  ) { }

  ngOnInit(): void {
  }

}
