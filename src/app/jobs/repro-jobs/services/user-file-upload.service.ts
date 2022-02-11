import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, merge, Observable, OperatorFunction, pipe, partition } from 'rxjs';
import { concatMap, filter, map, mapTo, mergeMap, pluck, scan, share, tap, throttleTime } from 'rxjs/operators';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { FileUploadEventType, FileUploadMessage, UploadMessageBase } from '../../interfaces/file-upload-message';
import { JobService } from '../../services/job.service';
import { JobsApiService } from '../../services/jobs-api.service';
import { UploadRef } from './upload-ref';

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
    private jobService: JobService,
  ) { }

  userFileUploadRef(files: File[]): UploadRef {

    const sortedFiles = files.sort((a, b) => a.size - b.size);
    const uploadMessages$ = from(sortedFiles).pipe(
      mergeMap(file => this.uploadFile(file), SIMULTANEOUS_UPLOADS),
    );

    const messages$ = merge(
      this.waitingMessages(sortedFiles),
      uploadMessages$
    ).pipe(
      this.uploadProgress(),
    );

    const uploadRef = new UploadRef(messages$, this.addFilesToJobFn());

    uploadRef.onCancel().pipe(
      concatMap(fileNames => this.deleteUploads(fileNames))
    ).subscribe();

    return uploadRef;
  }

  private deleteUploads(fileNames: string[]): Observable<null> {
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

    const upload$ = this.api.userFileUpload(formData).pipe(
      map(event => this.progressMessage(event, messageBase)),
      filter(event => event !== null),
      share(),
    );

    const [important$, nonImportant$] = partition(upload$, message => this.isImportant(message));

    return merge(
      important$,
      nonImportant$.pipe(throttleTime(PERCENT_REPORT_INTERVAL))
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

  private addFilesToJobFn(): (jobId: number, fileNames: string[]) => Observable<number> {
    return (jobId, fileNames) => this.jobService.moveUserFilesToJob(jobId, fileNames).pipe(
      pluck('jobId'),
    );
  }


}
