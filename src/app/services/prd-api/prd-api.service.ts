import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { CustomersApi } from './customers-api';
import { InvoicesApi } from './invoices-api';
import { JobsApi } from './jobs-api';
import { ProductsApi } from './products-api';
import { AppParams } from 'src/app/interfaces';
import { APP_PARAMS } from 'src/app/app-params';

@Injectable({
  providedIn: 'root'
})
export class PrdApiService {

  constructor(
    private http: HttpClient,
    @Inject(APP_PARAMS) private params: AppParams,
  ) { }

  private readonly apiPath = this.params.apiPath;

  customers = new CustomersApi(this.http, this.apiPath);
  products = new ProductsApi(this.http, this.apiPath);
  jobs = new JobsApi(this.http, this.apiPath);
  invoices = new InvoicesApi(this.http, this.apiPath);

}
