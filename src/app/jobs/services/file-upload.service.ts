import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, merge, Observable, of, Subject } from 'rxjs';
import { finalize, map, mergeMap, share, tap, throttleTime } from 'rxjs/operators';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { FileUploadEventType, FileUploadMessage, UploadMessageBase } from '../interfaces/file-upload-message';

/** Laiks, pēc kura tiek nosūtīts papildus slēdzošaias ziņojums */
const CLOSE_EVENT_DELAY = 1000 * 5;

/** Paralēlo augšupielāžu skaits vienam darbam */
const SIMULTANEOUS_UPLOADS = 2;

/** Minimālais laiks starp progresa ziņojumiem */
const PERCENT_REPORT_INTERVAL = 500;

@Injectable({ providedIn: 'any' })
export class FileUploadService {

  /** Svarīgie ziņojumi */
  private _uploadProgress$ = new Subject<Map<string, FileUploadMessage>>();
  /** Nesvarīgie ziņojumu (var tikt izlaisti) */
  private _uploadProgressPercent$ = new Subject<Map<string, FileUploadMessage>>();

  uploadProgress$ = merge(
    this._uploadProgressPercent$.pipe(throttleTime(PERCENT_REPORT_INTERVAL)),
    this._uploadProgress$,
  ).pipe(
    map(eventMapToArray),
    share(),
  );

  private uploadQueue: Map<string, File> = new Map();

  get filesCount(): number { return this.uploadQueue.size; }

  /* augšupielāde identificējas ar darba numuru un faila nosaukumu */
  private _activeUploads = new Map<string, FileUploadMessage>();

  constructor(
    private prdApi: PrdApiService,
  ) { }

  uploadFiles(jobId: number, files?: File[]): Observable<undefined> {
    if (!jobId || !files?.length) { return of(undefined); }
    const jobFiles = files
      .sort((a, b) => a.size - b.size); // mazākie vispirms

    this.startProgressWaiting(files);
    of(...jobFiles).pipe(
      mergeMap(file => this.uploadFile(jobId, file), SIMULTANEOUS_UPLOADS),
    ).subscribe();
    return of(undefined);
  }
  /**
   * Pievieno failus gaidīšanas sarakstam
   * @param files masīvs ar failiem
   */
  setFiles(files: File[]) {
    this.uploadQueue.clear();
    this._activeUploads.clear();
    files
      .sort((a, b) => a.size - b.size)
      .forEach(file => this.uploadQueue.set(uploadId(file), file));
    this.startProgressWaiting([...this.uploadQueue.values()]);
    this._uploadProgress$.next(this._activeUploads);
  }
  /**
   * Iztīra augšupielādes rindu
   */
  clearUploadQueue() {
    this.uploadQueue.clear();
    this._activeUploads.clear();
    this._uploadProgress$.next(this._activeUploads);
  }
  /**
   * Sāk augšupielādi ar sagatavoto rindu un doto darba numuru
   * @param jobId darba numurs
   */
  startUpload(jobId: number): Observable<any> {
    if (this.uploadQueue.size === 0) { return EMPTY; }
    return of(...this.uploadQueue.values()).pipe(
      mergeMap(file => this.uploadFile(jobId, file), SIMULTANEOUS_UPLOADS),
    );
  }

  private uploadFile(jobId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('fileUpload', file, file.name);
    return this.prdApi.jobs.fileUpload(jobId, formData).pipe(
      tap(ev => this.reportProgress(ev, file, jobId)),
      finalize(() => this.uploadQueue.delete(uploadId(file))),
    );
  }

  private startProgressWaiting(files: File[]): void {
    files.forEach(file => this._activeUploads.set(
      uploadId(file),
      {
        type: FileUploadEventType.UploadWaiting,
        id: uploadId(file),
        // jobId,
        name: file.name,
        size: file.size,
      }
    ));
  }

  private reportProgress(event: HttpEvent<any>, file: File, jobId: number): void {
    const id = uploadId(file);
    const messageBase: UploadMessageBase = {
      id,
      // jobId,
      name: file.name,
      size: file.size,
    };

    /* New upload started */
    if (event.type === HttpEventType.Sent) {
      this._activeUploads.set(id, {
        ...messageBase,
        jobId,
        type: FileUploadEventType.UploadStart,
      });
      this._uploadProgress$.next(this._activeUploads);
    }

    if (event.type === HttpEventType.UploadProgress) {
      this._activeUploads.set(id, {
        ...messageBase,
        type: FileUploadEventType.UploadProgress,
        done: event.loaded,
        jobId,
        precentDone: Math.round(100 * event.loaded / event.total),
      });
      this._uploadProgressPercent$.next(this._activeUploads);
    }

    if (event.type === HttpEventType.Response) {
      this._activeUploads.set(id, {
        ...messageBase,
        jobId,
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

/* kombinē augšupielādes Id no faila informācijas */
const uploadId = (file: File): string => file.name;

const eventMapToArray = (ev: Map<string, FileUploadMessage>): FileUploadMessage[] =>
  Array.from(ev.values());

