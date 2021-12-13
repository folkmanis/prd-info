import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { CustomersApi } from './customers-api';
import { InvoicesApi } from './invoices-api';
import { ProductsApi } from './products-api';
import { SystemPreferencesApi } from './system-preferences-api';
import { KastesApi } from './kastes-api';
import { KastesOrdersApi } from './kastes-orders-api';
import { UsersApi } from './users-api';
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

  customers = new CustomersApi(this.http, this.apiPath + 'customers/');
  products = new ProductsApi(this.http, this.apiPath + 'products/');
  invoices = new InvoicesApi(this.http, this.apiPath + 'invoices/');
  systemPreferences = new SystemPreferencesApi(this.http, this.apiPath + 'preferences/');
  kastes = new KastesApi(this.http, this.apiPath + 'kastes/');
  kastesOrders = new KastesOrdersApi(this.http, this.apiPath + 'kastes/jobs/');
  users = new UsersApi(this.http, this.apiPath + 'users/');
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
