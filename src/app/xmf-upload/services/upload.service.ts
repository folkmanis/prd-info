import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, Subject, interval, observable, BehaviorSubject } from 'rxjs';
import { XmfUploadResponse, XmfUploadProgress, XmfUploadProgressTable, UPLOAD_STATE } from './xmf-upload.class';
import { map, tap, last, switchMap, delay, takeWhile } from 'rxjs/operators';
import { HttpOptions } from 'src/app/library/http/http-options';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private httpPathUpload = '/data/xmf-upload/';
  /** Ielādes progrss (procentos) */
  uploadProgress$: Subject<number> = new Subject();
  /** Apstrādes ziņojums */
  uploadProgressChanges$: Subject<XmfUploadProgressTable> = new Subject();
  /** Formas statuss */
  uploadState$: BehaviorSubject<UPLOAD_STATE> = new BehaviorSubject(UPLOAD_STATE.NONE);

  constructor(
    private httpClient: HttpClient,
  ) { }
  /**
   * Augšuplādē failu ar papildinājumiem.
   * Atbildē saņem id kodu ar augšuplādes žurnāla numuru
   * @param file File objekts no formas
   */
  postFile(formData: FormData): Observable<XmfUploadProgressTable> {
    const req = new HttpRequest('POST', this.httpPathUpload + 'file', formData, { reportProgress: true });
    this.uploadProgress$.next(0);

    return this.httpClient.request<XmfUploadProgressTable>(req).pipe(
      map(event => this.reportUploadProgress(event)),
      last(),
      tap(resp => this.uploadProgressChanges$.next({
        _id: resp.id,
        fileName: resp.filename,
        fileSize: resp.size
      })),
      tap(() => this.uploadState$.next(UPLOAD_STATE.PROCESSING)),
      delay(500),
      this.reportProgress(),
      tap(ch => ch.state === 'finished' && this.uploadState$.next(UPLOAD_STATE.FINISHED)),
      tap(ch => this.uploadProgressChanges$.next(ch)),
    );
  }
  /** Pilns upload darbību saraksts tabulai */
  get statusLog$(): Observable<XmfUploadProgress[]> {
    return this.getStatussHttp();
  }
  /** http darbības ar serveri */
  private getStatussHttp(): Observable<XmfUploadProgress[]>;
  private getStatussHttp(id: string): Observable<XmfUploadProgress>;
  private getStatussHttp(id?: string): Observable<XmfUploadProgress | XmfUploadProgress[]> {
    if (id) {
      return this.httpClient.get<XmfUploadProgress>(this.httpPathUpload + 'upload-progress', new HttpOptions({ id }));
    } else {
      return this.httpClient.get<XmfUploadProgress[]>(this.httpPathUpload + 'upload-progress', new HttpOptions());
    }
  }

  private reportUploadProgress(event: HttpEvent<any>): XmfUploadResponse | null {
    switch (event.type) {
      case HttpEventType.Sent:
        this.uploadProgress$.next(100);
        return null;
      case HttpEventType.UploadProgress:
        this.uploadProgress$.next(Math.round(event.loaded / event.total * 100));
        return null;
      case HttpEventType.Response:
        return event.body;
      default:
        return null;
    }
  }

  /**
   * saņem id, faila nosaukumu
   * Intervāls
   * pieprasījums no servera
   * atbildes pārsūta, kamēr statuss nav gatavs
   * ja gatavs, tad nobeidzas
   */
  private reportProgress(_int: number = 2000): (obs: Observable<XmfUploadResponse>) => Observable<XmfUploadProgressTable> {
    let job: XmfUploadResponse;
    const serv = this;
    return (obs) => {
      return obs.pipe(
        tap(resp => job = resp),
        switchMap(() => interval(_int)),
        switchMap(() => serv.getStatussHttp(job.id)),
        takeWhile(stat => stat.state !== 'finished', true),
      );
    };
  }

}
