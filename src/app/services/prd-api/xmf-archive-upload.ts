import { ApiBase } from 'src/app/library/http/api-base';
import { XmfUploadHistory } from 'src/app/xmf-upload/interfaces/xmf-upload-history';
import { Observable } from 'rxjs';
import { HttpRequest, HttpResponse, HttpEvent } from '@angular/common/http';

interface Params {
    start?: number;
    limit?: number;
}

export class XmfArchiveUpload extends ApiBase<XmfUploadHistory> {

    getHistory(params: Params = {}): Observable<XmfUploadHistory[]> {
        return super.get(params);
    }

    uploadArchive(formData: FormData): Observable<HttpEvent<XmfUploadHistory>> {
        const req = new HttpRequest('POST', this.path, formData, { reportProgress: true });
        return this.http.request<XmfUploadHistory>(req);
    }

}