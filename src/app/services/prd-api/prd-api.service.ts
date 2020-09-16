import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { LoginApi } from './login-api';
import { CustomersApi } from './customers-api';
import { InvoicesApi } from './invoices-api';
import { JobsApi } from './jobs-api';
import { ProductsApi } from './products-api';
import { SystemPreferencesApi } from './system-preferences-api';
import { KastesApi } from './kastes-api';
import { KastesOrdersApi } from './kastes-orders-api';
import { UsersApi } from './users-api';
import { XmfArchiveApi } from './xmf-archive-api';
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
  kastes = new KastesApi(this.http, this.apiPath + 'kastes/');
  kastesOrders = new KastesOrdersApi(this.http, this.apiPath + 'kastes-orders/');
  users = new UsersApi(this.http, this.apiPath + 'users/');
  xmfArchive = new XmfArchiveApi(this.http, this.apiPath + 'xmf-archive/');
}
