import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { last } from 'lodash';
import { merge, Observable, of, OperatorFunction, partition, pipe } from 'rxjs';
import { concatMap, filter, map, mapTo, mergeMap, pluck, scan, share, tap, throttleTime } from 'rxjs/operators';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { FileUploadEventType, FileUploadMessage, UploadMessageBase, UploadWaitingMessage } from '../../interfaces/file-upload-message';
import { UploadRef } from './upload-ref';
import { JobsFilesApiService, JobFilesService } from 'src/app/filesystem';

const SIMULTANEOUS_UPLOADS = 2;
const PERCENT_REPORT_INTERVAL = 500;

const uploadId = (file: File): string => file.name;


@Injectable({
  providedIn: 'root'
})
export class UploadRefService {

  private isImportant = ({ type }: FileUploadMessage) =>
    type === FileUploadEventType.UploadFinish || type === FileUploadEventType.UploadStart;

  constructor(
    private sanitize: SanitizeService,
    private jobFilesService: JobFilesService,
    private filesApi: JobsFilesApiService,
  ) { }

  userFileUploadRef(file$: Observable<File>): UploadRef {

    const uploadMessages$ = file$.pipe(
      mergeMap(file => this.uploadFile(file), SIMULTANEOUS_UPLOADS),
    );

    const messages$ = merge(
      this.waitingMessages(file$),
      uploadMessages$
    ).pipe(
      this.uploadProgress(),
    );

    const uploadRef = new UploadRef(messages$, this.addUserFilesToJobFn());

    uploadRef.onCancel().pipe(
      concatMap(fileNames => this.jobFilesService.deleteUserUploads(fileNames))
    ).subscribe();

    return uploadRef;
  }

  ftpUploadRef(path: string[]): UploadRef {

    const fileName = last(path);
    const message: FileUploadMessage = {
      type: FileUploadEventType.UploadFinish,
      id: fileName,
      name: fileName,
      size: 0,
      fileNames: [fileName],
    };
    const progress$: Observable<FileUploadMessage[]> = of([message]);

    return new UploadRef(progress$, this.addFtpFilesToJobFn(path.slice(0, -1)));

  }

  savedFileRef(fileNames: string[]): UploadRef {
    const messages: FileUploadMessage[] = fileNames.map(name => ({
      type: FileUploadEventType.UploadFinish,
      id: name,
      name,
      size: 0,
      fileNames: [name],
    }));
    const messages$: Observable<FileUploadMessage[]> = of(messages);

    const uploadRef = new UploadRef(messages$, this.addUserFilesToJobFn());

    uploadRef.onCancel().pipe(
      concatMap(fileNames => this.jobFilesService.deleteUserUploads(fileNames))
    ).subscribe();

    return uploadRef;
  }

  private uploadFile(file: File): Observable<FileUploadMessage> {

    const messageBase: UploadMessageBase = {
      id: uploadId(file),
      name: file.name,
      size: file.size,
    };

    const upload$ = this.jobFilesService.uploadUserFile(file).pipe(
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

  private waitingMessages(file$: Observable<File>): Observable<UploadWaitingMessage> {
    return file$.pipe(
      map(file => ({
        type: FileUploadEventType.UploadWaiting,
        id: uploadId(file),
        name: this.sanitize.sanitizeFileName(file.name),
        size: file.size,
      }))
    );
  }

  private addUserFilesToJobFn(): (jobId: number, fileNames: string[]) => Observable<number> {
    return (jobId, fileNames) => this.jobFilesService.moveUserFilesToJob(jobId, fileNames).pipe(
      pluck('jobId'),
    );
  }

  private addFtpFilesToJobFn(basePath: string[]): (jobId: number, fileNames: string[]) => Observable<number> {
    return (jobId, fileNames) => this.jobFilesService.copyFtpFilesToJob(
      jobId,
      fileNames.map(name => [...basePath, name])
    ).pipe(
      pluck('jobId'),
    );
  }


}
