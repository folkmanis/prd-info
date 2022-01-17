import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { XmfUploadProgress } from '../interfaces/xmf-upload-progress';
import { ApiBase } from 'src/app/library/http/api-base';
import { Inject, Injectable } from '@angular/core';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams } from 'src/app/interfaces';
import { ClassTransformer } from 'class-transformer';
import { map } from 'rxjs/operators';

interface Params {
    start?: number;
    limit?: number;
}

@Injectable({
    providedIn: 'root'
})
export class XmfArchiveUploadApiService extends ApiBase<XmfUploadProgress> {

    constructor(
        @Inject(APP_PARAMS) params: AppParams,
        http: HttpClient,
        private transformer: ClassTransformer,
    ) {
        super(http, params.apiPath + 'xmf-upload/');
    }

    getHistory(params: Params = {}): Observable<XmfUploadProgress[]> {
        return super.get<Record<string, any>[]>(params).pipe(
            map(data => this.transformer.plainToInstance(XmfUploadProgress, data))
        );
    }

    uploadArchive(formData: FormData): Observable<HttpEvent<XmfUploadProgress>> {
        const req = new HttpRequest('POST', this.path, formData, { reportProgress: true });
        return this.http.request<XmfUploadProgress>(req);
    }

}