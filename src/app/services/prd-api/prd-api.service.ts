import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { InvoicesApi } from './invoices-api';
import { UsersApi } from './users-api';
import { AppParams } from 'src/app/interfaces';
import { APP_PARAMS } from 'src/app/app-params';
import { PaytraqApi } from './paytraq-api';
import { MaterialsApi } from './materials-api';
import { EquipmentApi } from './equipment-api';
import { ProductionStagesApi } from './production-stages-api';


@Injectable({
  providedIn: 'root'
})
export class PrdApiService {

  readonly apiPath = this.params.apiPath;

  invoices = new InvoicesApi(this.http, this.apiPath + 'invoices/');
  users = new UsersApi(this.http, this.apiPath + 'users/');
  paytraq = new PaytraqApi(this.http, this.apiPath + 'paytraq/');
  materials = new MaterialsApi(this.http, this.apiPath + 'materials/');
  equipment = new EquipmentApi(this.http, this.apiPath + 'equipment/');
  productionStages = new ProductionStagesApi(this.http, this.apiPath + 'production-stages/');

  constructor(
    private http: HttpClient,
    @Inject(APP_PARAMS) private params: AppParams,
  ) { }

}
