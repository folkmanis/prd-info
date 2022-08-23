import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AppParams } from 'src/app/interfaces';
import { APP_PARAMS } from 'src/app/app-params';
import { EquipmentApi } from './equipment-api';


@Injectable({
  providedIn: 'root'
})
export class PrdApiService {

  readonly apiPath = this.params.apiPath;

  equipment = new EquipmentApi(this.http, this.apiPath + 'equipment/');

  constructor(
    private http: HttpClient,
    @Inject(APP_PARAMS) private params: AppParams,
  ) { }

}
