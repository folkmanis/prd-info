import { HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Job, JobResponse, JobsWithoutInvoicesTotals } from 'src/app/interfaces';
import { ApiBase, HttpOptions } from 'src/app/library/http';


export class JobsApi extends ApiBase<Job> {

    importJobs(data: any): Observable<number> {
        return this.http.post<JobResponse>(this.path + 'jobimport', data, new HttpOptions()).pipe(
            map(resp => resp.modifiedCount)
        );
    }

    insertMany(jobs: Partial<Job>[]): Observable<number> {
        return this.http.put<JobResponse>(this.path, jobs, new HttpOptions()).pipe(
            map(resp => resp.insertedCount)
        );
    }

    jobsWithoutInvoicesTotals(): Observable<JobsWithoutInvoicesTotals[]> {
        return this.http.get<JobResponse>(this.path + 'jobs-without-invoices-totals', new HttpOptions().cacheable()).pipe(
            map(resp => resp.jobsWithoutInvoicesTotals),
        );
    }

    fileUpload(jobId: number, form: FormData): Observable<HttpEvent<JobResponse>> {
        const request = new HttpRequest(
            'POST',
            this.path + jobId + '/file',
            form,
            { reportProgress: true, }
        );
        return this.http.request<JobResponse>(request);
    }

}
