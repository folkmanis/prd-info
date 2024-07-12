import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClassTransformer } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getAppParams } from 'src/app/app-params';
import { HttpOptions } from 'src/app/library';
import { XmfUploadProgress } from '../interfaces/xmf-upload-progress';

interface Params {
  start?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class XmfArchiveUploadApiService {
  private readonly path = getAppParams('apiPath') + 'xmf-upload/';

  constructor(
    private http: HttpClient,
    private transformer: ClassTransformer,
  ) {}

  getHistory(params: Params = {}): Observable<XmfUploadProgress[]> {
    return this.http.get<Record<string, any>[]>(this.path, new HttpOptions(params).cacheable()).pipe(map((data) => this.transformer.plainToInstance(XmfUploadProgress, data)));
  }

  uploadArchive(formData: FormData): Observable<XmfUploadProgress> {
    return this.http.post<Record<string, any>>(this.path, formData).pipe(map((data) => this.transformer.plainToInstance(XmfUploadProgress, data)));
  }
}
