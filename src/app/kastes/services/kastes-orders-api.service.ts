import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams } from 'src/app/interfaces';
import { KastesJob } from 'src/app/jobs';
import { ApiBase } from 'src/app/library/http';

@Injectable({
    providedIn: 'root'
})
export class KastesOrdersApiService extends ApiBase<KastesJob> {

    constructor(
        @Inject(APP_PARAMS) params: AppParams,
        http: HttpClient,
    ) {
        super(http, params.apiPath + 'kastes/jobs/');
    }


}
