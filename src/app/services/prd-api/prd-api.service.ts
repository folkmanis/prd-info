import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AppParams } from 'src/app/interfaces';
import { APP_PARAMS } from 'src/app/app-params';


@Injectable({
  providedIn: 'root'
})
export class PrdApiService {

  readonly apiPath = this.params.apiPath;

  constructor(
    private http: HttpClient,
    @Inject(APP_PARAMS) private params: AppParams,
  ) { }

}
