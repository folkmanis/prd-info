import { HttpClient } from '@angular/common/http';
import { Observable, merge, Subject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBase } from 'src/app/library';
import { Job, JobResponse } from 'src/app/interfaces';
import { AppHttpResponseBase, HttpOptions } from 'src/app/library';


export class JobsApi extends ApiBase<Job> {

    constructor(
        http: HttpClient, path: string
    ) {
        super(http, path + 'jobs/');
    }

    importJobs(data: any): Observable<number> {
        return this.http.post<JobResponse>(this.path + 'jobimport', data, new HttpOptions()).pipe(
            map(resp => resp.modifiedCount)
        );
    }

}
