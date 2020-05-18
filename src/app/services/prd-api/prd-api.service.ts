import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomersApi } from './customers-api';
import { InvoicesApi } from './invoices-api';
import { JobsApi } from './jobs-api';
import { ProductsApi } from './products-api';

const HTTP_PATH = '/data/';

@Injectable({
  providedIn: 'root'
})
export class PrdApiService {

  constructor(
    private http: HttpClient
  ) { }

  customers = new CustomersApi(this.http, HTTP_PATH);
  products = new ProductsApi(this.http, HTTP_PATH);
  jobs = new JobsApi(this.http, HTTP_PATH);
  invoices = new InvoicesApi(this.http, HTTP_PATH);

}
