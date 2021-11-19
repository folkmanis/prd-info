import { HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { XmfUploadProgress } from 'src/app/interfaces/xmf-search';
import { ApiBase } from 'src/app/library/http/api-base';

interface Params {
    start?: number;
    limit?: number;
}

export class XmfArchiveUpload extends ApiBase<XmfUploadProgress> {

    getHistory(params: Params = {}): Observable<XmfUploadProgress[]> {
        return super.get(params);
    }

    uploadArchive(formData: FormData): Observable<HttpEvent<XmfUploadProgress>> {
        const req = new HttpRequest('POST', this.path, formData, { reportProgress: true });
        return this.http.request<XmfUploadProgress>(req);
    }

}