import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAppParams } from 'src/app/app-params';
import { KastesJob } from 'src/app/jobs';
import { HttpOptions } from 'src/app/library/http';
import { KastesJobPartial } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class KastesOrdersApiService {

    private readonly path = getAppParams('apiPath') + 'kastes/jobs/';

    constructor(
        private http: HttpClient,
    ) { }

    getAll(filter: Record<string, any>) {
        return this.http.get<KastesJobPartial[]>(this.path, new HttpOptions(filter).cacheable());
    }

    getOne(jobId: number) {
        return this.http.get<KastesJob>(this.path + jobId, new HttpOptions().cacheable());
    }


}
