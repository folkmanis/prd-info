import { Component, OnInit } from '@angular/core';
import { Invoice } from 'src/app/interfaces';
import { InvoicesListDatasource } from './invoices-list-datasource';
import { InvoicesService } from '../../services';

const COLUMNS = ['invoiceId', 'customer', 'createdDateString', 'totalAll'];

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.css']
})
export class InvoicesListComponent implements OnInit {

  constructor(
    private service: InvoicesService,
  ) { }
  displayedColumns: string[] = COLUMNS;
  datasource = new InvoicesListDatasource(this.service);

  ngOnInit(): void {
  }

}
