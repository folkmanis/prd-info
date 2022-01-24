import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, merge, Observable, of, Subject } from 'rxjs';
import { finalize, map, mapTo, mergeMap, share, shareReplay, tap, throttleTime } from 'rxjs/operators';
import { FileUploadEventType, FileUploadMessage, UploadMessageBase } from '../../interfaces/file-upload-message';
import { JobsApiService } from '../../services/jobs-api.service';
import { SanitizeService } from 'src/app/library/services/sanitize.service';

const CLOSE_EVENT_DELAY = 1000 * 5;
const SIMULTANEOUS_UPLOADS = 2;
const PERCENT_REPORT_INTERVAL = 500;

const uploadId = (file: File): string => file.name;

@Injectable({ providedIn: 'root' })
export class FileUploadService {

  /** Svarīgie ziņojumi */
  private _uploadProgress$ = new Subject<Map<string, FileUploadMessage>>();
  /** Nesvarīgie ziņojumu (var tikt izlaisti) */
  private _uploadProgressPercent$ = new Subject<Map<string, FileUploadMessage>>();

  uploadProgress$ = merge(
    this._uploadProgressPercent$.pipe(throttleTime(PERCENT_REPORT_INTERVAL)),
    this._uploadProgress$,
  ).pipe(
    map(eventMap => [...eventMap.values()]),
    shareReplay(1),
  );

  private uploadQueue: Map<string, File> = new Map();

  get filesCount(): number { return this.uploadQueue.size; }

  /* augšupielāde identificējas ar darba numuru un faila nosaukumu */
  private _activeUploads = new Map<string, FileUploadMessage>();

  constructor(
    private api: JobsApiService,
    private sanitize: SanitizeService,
  ) { }

  /**
   * Pievieno failus gaidīšanas sarakstam
   *
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
   *
   * @param jobId darba numurs
   */
  startUpload(jobId: number): Observable<number> {
    if (this.uploadQueue.size === 0) return of(jobId);
    return of(...this.uploadQueue.values()).pipe(
      mergeMap(file => this.uploadFile(jobId, file), SIMULTANEOUS_UPLOADS),
      mapTo(jobId),
    );
  }

  private uploadFile(jobId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('fileUpload', file, this.sanitize.sanitizeFileName(file.name));
    return this.api.fileUpload(jobId, formData).pipe(
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
        name: file.name,
        size: file.size,
      }
    ));
  }

  private reportProgress(event: HttpEvent<any>, file: File, jobId: number): void {
    const id = uploadId(file);
    const messageBase: UploadMessageBase = {
      id,
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

