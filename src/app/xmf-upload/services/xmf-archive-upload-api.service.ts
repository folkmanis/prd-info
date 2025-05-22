import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getAppParams } from 'src/app/app-params';
import { HttpOptions, ValidatorService } from 'src/app/library';
import { XmfUploadProgress } from '../interfaces/xmf-upload-progress';

interface Params {
  start?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class XmfArchiveUploadApiService {
  #path = getAppParams('apiPath') + 'xmf-upload/';
  #validator = inject(ValidatorService);
  #http = inject(HttpClient);

  getHistory(params: Params = {}): Promise<XmfUploadProgress[]> {
    const data$ = this.#http.get<Record<string, any>[]>(this.#path, new HttpOptions(params).cacheable());
    return this.#validator.validateArrayAsync(XmfUploadProgress, data$);
  }

  uploadArchive(formData: FormData): Promise<XmfUploadProgress> {
    const data$ = this.#http.post<Record<string, any>>(this.#path, formData);
    return this.#validator.validateAsync(XmfUploadProgress, data$);
  }
}
