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
import { XmfArchiveUpload } from './xmf-archive-upload';
import { AppParams } from 'src/app/interfaces';
import { APP_PARAMS } from 'src/app/app-params';
import { PaytraqApi } from './paytraq-api';
import { MaterialsApi } from './materials-api';
import { NotificationsApi } from './notifications-api';
import { EquipmentApi } from './equipment-api';
import { ProductionStagesApi } from './production-stages-api';
import { LogfileApi } from './logfile-api';

@Injectable({
  providedIn: 'root'
})
export class PrdApiService {

  readonly apiPath = this.params.apiPath;

  login = new LoginApi(this.http, this.apiPath + 'login/');
  customers = new CustomersApi(this.http, this.apiPath + 'customers/');
  products = new ProductsApi(this.http, this.apiPath + 'products/');
  jobs = new JobsApi(this.http, this.apiPath + 'jobs/');
  invoices = new InvoicesApi(this.http, this.apiPath + 'invoices/');
  systemPreferences = new SystemPreferencesApi(this.http, this.apiPath + 'preferences/');
  kastes = new KastesApi(this.http, this.apiPath + 'kastes/');
  kastesOrders = new KastesOrdersApi(this.http, this.apiPath + 'kastes/jobs/');
  users = new UsersApi(this.http, this.apiPath + 'users/');
  xmfArchive = new XmfArchiveApi(this.http, this.apiPath + 'xmf-search/');
  xmfArchiveUpload = new XmfArchiveUpload(this.http, this.apiPath + 'xmf-upload/');
  paytraq = new PaytraqApi(this.http, this.apiPath + 'paytraq/');
  materials = new MaterialsApi(this.http, this.apiPath + 'materials/');
  notifications = new NotificationsApi(this.http, this.apiPath + 'notifications/');
  equipment = new EquipmentApi(this.http, this.apiPath + 'equipment/');
  productionStages = new ProductionStagesApi(this.http, this.apiPath + 'production-stages/');
  logfile = new LogfileApi(this.http, this.apiPath + 'logging/');

  constructor(
    private http: HttpClient,
    @Inject(APP_PARAMS) private params: AppParams,
  ) { }

}
