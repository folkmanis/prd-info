import { HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Job, JobsWithoutInvoicesTotals } from 'src/app/interfaces';
import { ApiBase, HttpOptions } from 'src/app/library/http';


export class JobsApi extends ApiBase<Job> {

    jobsWithoutInvoicesTotals(): Observable<JobsWithoutInvoicesTotals[]> {
        return this.http.get<JobsWithoutInvoicesTotals[]>(this.path + 'jobs-without-invoices-totals', new HttpOptions().cacheable());
    }

    createFolder(jobId: number): Observable<Job> {
        return this.http.patch<Job>(this.path + jobId + '/createFolder', {}, new HttpOptions());
    }

    fileUpload(jobId: number, form: FormData): Observable<HttpEvent<Job>> {
        const request = new HttpRequest(
            'PUT',
            this.path + jobId + '/file',
            form,
            { reportProgress: true, }
        );
        return this.http.request<Job>(request);
    }

}
