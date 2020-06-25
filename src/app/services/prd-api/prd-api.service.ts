import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { LoginApi } from './login-api';
import { CustomersApi } from './customers-api';
import { InvoicesApi } from './invoices-api';
import { JobsApi } from './jobs-api';
import { ProductsApi } from './products-api';
import { SystemPreferencesApi } from './system-preferences-api';
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

  login = new LoginApi(this.http, this.apiPath + 'login/');
  customers = new CustomersApi(this.http, this.apiPath + 'customers/');
  products = new ProductsApi(this.http, this.apiPath + 'products/');
  jobs = new JobsApi(this.http, this.apiPath + 'jobs/');
  invoices = new InvoicesApi(this.http, this.apiPath + 'invoices/');
  systemPreferences = new SystemPreferencesApi(this.http, this.apiPath + 'preferences/');

}