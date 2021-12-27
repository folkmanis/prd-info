import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiBase } from 'src/app/library/http';
import { PreferencesDbModule } from 'src/app/interfaces';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams } from 'src/app/interfaces';

@Injectable({
    providedIn: 'root'
})
export class SystemPreferencesApiService extends ApiBase<PreferencesDbModule> {

    constructor(
        @Inject(APP_PARAMS) params: AppParams,
        http: HttpClient,
    ) {
        super(http, params.apiPath + 'preferences/');
    }

}
