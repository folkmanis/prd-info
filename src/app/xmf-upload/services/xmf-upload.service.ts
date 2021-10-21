import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { last, map, switchMap, tap } from 'rxjs/operators';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { XmfUploadHistory } from '../interfaces/xmf-upload-history';

@Injectable({
  providedIn: 'root'
})
export class XmfUploadService {

  constructor(
    private prdApi: PrdApiService,
  ) { }

  getHistory(): Observable<XmfUploadHistory[]> {
    return this.prdApi.xmfArchiveUpload.getHistory();
  }

  postFile(formData: FormData, progress$: Subject<number>): Observable<XmfUploadHistory> {
    progress$.next(0);
    return this.prdApi.xmfArchiveUpload.uploadArchive(formData).pipe(
      map(this.reportUploadProgress(progress$)),
      last(),
    );
  }

  validateFile(fl: File): boolean {
    const ext = fl.name.slice((Math.max(0, fl.name.lastIndexOf('.')) || Infinity) + 1);
    return ext === 'dbd';
  }

  private reportUploadProgress(progress$: Subject<number>) {
    return (event: HttpEvent<XmfUploadHistory>): XmfUploadHistory | null => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          progress$.next(Math.round(event.loaded / event.total * 100));
          return null;
        case HttpEventType.Response:
          progress$.next(100);
          return event.body;
        default:
          return null;
      }
    };

  }



}
