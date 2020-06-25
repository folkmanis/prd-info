import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Job, JobResponse } from 'src/app/interfaces';
import { ApiBase, HttpOptions } from 'src/app/library';


export class JobsApi extends ApiBase<Job> {

    insertMany(data: Partial<Job>[]): Observable<number[] | null> {
        return this.http.put<JobResponse>(this.path, data, new HttpOptions()).pipe(
            map(resp => resp.error ? null : resp.insertedIds)
        );
    }

    importJobs(data: any): Observable<number> {
        return this.http.post<JobResponse>(this.path + 'jobimport', data, new HttpOptions()).pipe(
            map(resp => resp.modifiedCount)
        );
    }

}
