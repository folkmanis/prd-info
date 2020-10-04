import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { map, mergeMap, tap } from 'rxjs/operators';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { FileUploadEventType, FileUploadMessage, UploadMessageBase } from '../interfaces/file-upload-message';

/** Laiks, pēc kura tiek nosūtīts papildus slēdzošaias ziņojums */
const CLOSE_EVENT_DELAY = 10 * 1000;


@Injectable()
export class FileUploadService {

  private _uploadProgress$ = new Subject<FileUploadMessage[]>();
  uploadProgress$ = this._uploadProgress$.asObservable();

  /* augšupielāde identificējas ar darba numuru un faila nosaukumu */
  private _activeUploads = new Map<string, FileUploadMessage>();

  constructor(
    private prdApi: PrdApiService,
  ) { }

  uploadFiles(id: number, files?: File[]): Observable<void> {
    console.log(id, ...files.map(file => file.name));
    if (!id || files?.length < 1) { return of(); }
    const jobFiles = files.map(file => ({ file, jobId: id }));

    of(...jobFiles).pipe(
      mergeMap(({ jobId, file }) => this.uploadFile(jobId, file), 2)
    ).subscribe();
    return of();
  }

  private uploadFile(jobId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('fileUpload', file, file.name);
    return this.prdApi.jobs.fileUpload(jobId, formData).pipe(
      // tap(ev => console.log(ev)),
      map(ev => this.reportProgress(ev, file, jobId)),
    );
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
    }

    if (event.type === HttpEventType.UploadProgress) {
      this._activeUploads.set(id, {
        ...messageBase,
        type: FileUploadEventType.UploadProgress,
        done: event.loaded,
        precentDone: Math.round(100 * event.loaded / event.total),
      });
    }

    if (event.type === HttpEventType.Response) {
      this._activeUploads.set(id, {
        ...messageBase,
        type: FileUploadEventType.UploadFinish,
      });
      setTimeout(() => {
        this._activeUploads.delete(id);
        this._uploadProgress$.next([...this._activeUploads.values()]);
      }, CLOSE_EVENT_DELAY);
    }
    this._uploadProgress$.next(eventMapToSortedArray(this._activeUploads));
  }

}

/* kombinē augšupielādes Id no darba nr. un faila nosaukuma */
const uploadId = (jobId: number, fileName: string): string =>
  jobId.toString + fileName;

const eventMapToSortedArray = (ev: Map<string, FileUploadMessage>): FileUploadMessage[] =>
  Array.from(ev.values())
    .sort((a, b) => a.type - b.type);

