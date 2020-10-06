import { Injectable } from '@angular/core';
import { Observable, Subject, of, merge } from 'rxjs';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { map, mergeMap, share, tap, delay } from 'rxjs/operators';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { FileUploadEventType, FileUploadMessage, UploadMessageBase } from '../interfaces/file-upload-message';
import { filterTime } from 'src/app/library/rx';

/** Laiks, pēc kura tiek nosūtīts papildus slēdzošaias ziņojums */
const CLOSE_EVENT_DELAY = 1000 * 5;


@Injectable()
export class FileUploadService {

  private _uploadProgress$ = new Subject<Map<string, FileUploadMessage>>();
  private _uploadProgressPercent$ = new Subject<Map<string, FileUploadMessage>>();

  uploadProgress$ = merge(
    this._uploadProgressPercent$.pipe(filterTime(500)),
    this._uploadProgress$,
  ).pipe(
    map(eventMapToSortedArray),
    share(),
  );

  /* augšupielāde identificējas ar darba numuru un faila nosaukumu */
  private _activeUploads = new Map<string, FileUploadMessage>();

  constructor(
    private prdApi: PrdApiService,
  ) { }

  uploadFiles(jobId: number, files?: File[]): Observable<void> {
    if (!jobId || files?.length < 1) { return of(); }
    const jobFiles = files
      .sort((a, b) => a.size - b.size); // mazākie vispirms

    this.startProgressWaiting(jobId, files);
    of(...jobFiles).pipe(
      mergeMap(file => this.uploadFile(jobId, file), 2),
    ).subscribe();
    return of();
  }

  private uploadFile(jobId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('fileUpload', file, file.name);
    return this.prdApi.jobs.fileUpload(jobId, formData).pipe(
      map(ev => this.reportProgress(ev, file, jobId)),
    );
  }

  private startProgressWaiting(jobId: number, files: File[]): void {
    files.forEach(file => this._activeUploads.set(
      uploadId(jobId, file.name),
      {
        type: FileUploadEventType.UploadWaiting,
        id: uploadId(jobId, file.name),
        jobId,
        name: file.name,
        size: file.size,
      }
    ));
  }

  private reportProgress(event: HttpEvent<any>, file: File, jobId: number) {
    const id = uploadId(jobId, file.name);
    const messageBase: UploadMessageBase = {
      id,
      jobId,
      name: file.name,
      size: file.size,
    };

    /* New upload started */
    if (event.type === HttpEventType.Sent) {
      this._activeUploads.set(id, {
        ...messageBase,
        type: FileUploadEventType.UploadStart,
      });
      this._uploadProgress$.next(this._activeUploads);
    }

    if (event.type === HttpEventType.UploadProgress) {
      this._activeUploads.set(id, {
        ...messageBase,
        type: FileUploadEventType.UploadProgress,
        done: event.loaded,
        precentDone: Math.round(100 * event.loaded / event.total),
      });
      this._uploadProgressPercent$.next(this._activeUploads);
    }

    if (event.type === HttpEventType.Response) {
      this._activeUploads.set(id, {
        ...messageBase,
        type: FileUploadEventType.UploadFinish,
      });
      setTimeout(() => {
        this._activeUploads.delete(id);
        this._uploadProgress$.next(this._activeUploads);
      }, CLOSE_EVENT_DELAY);
      this._uploadProgress$.next(this._activeUploads);
    }
  }

}

/* kombinē augšupielādes Id no darba nr. un faila nosaukuma */
const uploadId = (jobId: number, fileName: string): string =>
  jobId.toString() + fileName;

const eventMapToSortedArray = (ev: Map<string, FileUploadMessage>): FileUploadMessage[] =>
  Array.from(ev.values());

