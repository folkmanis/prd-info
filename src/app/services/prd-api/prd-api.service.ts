import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { InvoicesApi } from './invoices-api';
import { UsersApi } from './users-api';
import { AppParams } from 'src/app/interfaces';
import { APP_PARAMS } from 'src/app/app-params';
import { PaytraqApi } from './paytraq-api';
import { EquipmentApi } from './equipment-api';


@Injectable({
  providedIn: 'root'
})
export class PrdApiService {

  readonly apiPath = this.params.apiPath;

  invoices = new InvoicesApi(this.http, this.apiPath + 'invoices/');
  users = new UsersApi(this.http, this.apiPath + 'users/');
  paytraq = new PaytraqApi(this.http, this.apiPath + 'paytraq/');
  equipment = new EquipmentApi(this.http, this.apiPath + 'equipment/');

  constructor(
    private http: HttpClient,
    @Inject(APP_PARAMS) private params: AppParams,
  ) { }

}
