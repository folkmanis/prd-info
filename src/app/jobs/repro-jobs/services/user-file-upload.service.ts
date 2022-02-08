import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { FileUploadEventType, FileUploadMessage, UploadMessageBase } from '../../interfaces/file-upload-message';
import { EMPTY, from, merge, Observable, of, OperatorFunction, pipe, Subject } from 'rxjs';
import { catchError, filter, finalize, map, mapTo, mergeMap, scan, share, shareReplay, startWith, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { JobsApiService } from '../../services/jobs-api.service';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { log } from 'prd-cdk';

const SIMULTANEOUS_UPLOADS = 2;
const PERCENT_REPORT_INTERVAL = 500;

const uploadId = (file: File): string => file.name;


@Injectable({
  providedIn: 'root'
})
export class UserFileUploadService {

  private isImportant = ({ type }: FileUploadMessage) =>
    type === FileUploadEventType.UploadFinish || type === FileUploadEventType.UploadStart;

  constructor(
    private api: JobsApiService,
    private sanitize: SanitizeService,
  ) { }

  upload(files: File[], cancel$: Observable<void>) {

    const sortedFiles = files.sort((a, b) => a.size - b.size);
    const uploadMessages$ = from(sortedFiles).pipe(
      mergeMap(file => this.uploadFile(file), SIMULTANEOUS_UPLOADS),
      share(),
    );
    const importantMessages$ = uploadMessages$.pipe(
      filter(message => this.isImportant(message))
    );
    const otherMessages$ = uploadMessages$.pipe(
      filter(message => !this.isImportant(message)),
      throttleTime(PERCENT_REPORT_INTERVAL),
    );

    return merge(
      this.waitingMessages(sortedFiles),
      importantMessages$,
      otherMessages$
    ).pipe(
      this.uploadProgress(),
    );

  }

  deleteUploads(fileNames: string[]): Observable<null> {
    return this.api.deleteUserFiles(fileNames).pipe(
      tap(count => {
        if (count !== fileNames.length) {
          throw new Error('Not all uploads deleted');
        }
      }),
      mapTo(null),
    );
  }

  private uploadFile(file: File): Observable<FileUploadMessage> {

    const formData = new FormData();
    const name = this.sanitize.sanitizeFileName(file.name);

    formData.append('fileUpload', file, name);

    const messageBase: UploadMessageBase = {
      id: uploadId(file),
      name,
      size: file.size,
    };

    return this.api.userFileUpload(formData).pipe(
      map(event => this.progressMessage(event, messageBase)),
      filter(event => event !== null),
    );
  }


  private progressMessage(
    event: HttpEvent<{ names: string[]; }>,
    messageBase: UploadMessageBase,
  ): FileUploadMessage | null {


    /* New upload started */
    if (event.type === HttpEventType.Sent) {
      return {
        ...messageBase,
        type: FileUploadEventType.UploadStart,
      };
    }

    if (event.type === HttpEventType.UploadProgress) {
      return {
        ...messageBase,
        type: FileUploadEventType.UploadProgress,
        done: event.loaded,
        percentDone: Math.round(100 * event.loaded / event.total),
      };
    }

    if (event.type === HttpEventType.Response) {
      const fileNames = event.body;
      return {
        ...messageBase,
        type: FileUploadEventType.UploadFinish,
        fileNames: event.body.names,
      };
    }

    return null;

  }

  private uploadProgress(): OperatorFunction<FileUploadMessage, FileUploadMessage[]> {
    return pipe(
      scan((acc, msg) => acc.set(msg.id, msg), new Map<string, FileUploadMessage>()),
      map(acc => [...acc.values()])
    );

  }

  private waitingMessages(files: File[]): Observable<FileUploadMessage> {
    const waiting: FileUploadMessage[] = files.map(file => ({
      type: FileUploadEventType.UploadWaiting,
      id: uploadId(file),
      name: this.sanitize.sanitizeFileName(file.name),
      size: file.size,
    }));
    return from(waiting);
  }


}
