import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { httpResponseRequest, validatorFn } from 'src/app/library';
import { XmfUploadProgress } from '../interfaces/xmf-upload-progress';

@Service()
export class XmfArchiveUploadApiService {
  #path = getAppParams('apiPath') + 'xmf-upload/';
  #http = inject(HttpClient);

  getHistoryResource(): HttpResourceRef<XmfUploadProgress[] | undefined> {
    return httpResource(() => httpResponseRequest(this.#path), {
      parse: validatorFn(XmfUploadProgress.array()),
    });
  }

  uploadArchive(formData: FormData): Observable<XmfUploadProgress> {
    return this.#http.post(this.#path, formData).pipe(map(validatorFn(XmfUploadProgress)));
  }
}
