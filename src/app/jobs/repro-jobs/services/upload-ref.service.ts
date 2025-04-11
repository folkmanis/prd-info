import { HttpEvent, HttpEventType } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { last } from 'lodash-es';
import { concatMap, EMPTY, filter, map, merge, mergeMap, Observable, of, OperatorFunction, partition, pipe, scan, share, switchMap, throttleTime } from 'rxjs';
import { JobFilesService } from 'src/app/filesystem';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { Job } from '../../interfaces';
import { FileUploadEventType, FileUploadMessage, UploadMessageBase, UploadWaitingMessage } from '../../interfaces/file-upload-message';
import { UploadRef } from './upload-ref';
import { notNullOrDefault, stringOrThrow } from 'src/app/library';

const SIMULTANEOUS_UPLOADS = 2;
const PERCENT_REPORT_INTERVAL = 500;

const uploadId = (file: File): string => file.name;

@Injectable({
  providedIn: 'root',
})
export class UploadRefService {
  private sanitize = inject(SanitizeService);
  private jobFilesService = inject(JobFilesService);

  private isImportant = ({ type }: FileUploadMessage) => type === FileUploadEventType.UploadFinish || type === FileUploadEventType.UploadStart;

  private uploadRef: UploadRef | null = null;

  retrieveUploadRef() {
    const uploadRef = this.uploadRef;
    this.uploadRef = null;
    return uploadRef;
  }

  setUserFile(file$: Observable<File>, afterAddedToJob: Observable<unknown>) {
    const uploadMessages$ = file$.pipe(mergeMap((file) => this.uploadFile(file), SIMULTANEOUS_UPLOADS));

    const messages$ = merge(this.waitingMessages(file$), uploadMessages$).pipe(this.uploadProgress());

    const uploadRef = new UploadRef(messages$, this.addUserFilesToJobFn());

    uploadRef
      .onCancel()
      .pipe(concatMap((fileNames) => this.jobFilesService.deleteUserUploads(fileNames)))
      .subscribe();

    uploadRef
      .onAddedToJob()
      .pipe(switchMap(() => afterAddedToJob))
      .subscribe();

    this.uploadRef = uploadRef;
  }

  setFtpUpload(path: string[], afterAddedToJob: Observable<unknown>) {
    const fileName = stringOrThrow(last(path));
    const message: FileUploadMessage = {
      type: FileUploadEventType.UploadFinish,
      id: fileName,
      name: fileName,
      size: 0,
      fileNames: [fileName],
    };

    const progress$: Observable<FileUploadMessage[]> = of([message]);
    const uploadRef = new UploadRef(progress$, this.addFtpFilesToJobFn(path.slice(0, -1)));

    uploadRef
      .onAddedToJob()
      .pipe(switchMap(() => afterAddedToJob))
      .subscribe();

    this.uploadRef = uploadRef;
  }

  setSavedFile(fileNames: string[], afterAddedToJob: Observable<unknown>) {
    const messages: FileUploadMessage[] = fileNames.map((name) => ({
      type: FileUploadEventType.UploadFinish,
      id: name,
      name,
      size: 0,
      fileNames: [name],
    }));
    const messages$: Observable<FileUploadMessage[]> = of(messages);

    const uploadRef = new UploadRef(messages$, this.addUserFilesToJobFn());

    uploadRef
      .onCancel()
      .pipe(concatMap((names) => this.jobFilesService.deleteUserUploads(names)))
      .subscribe();

    uploadRef
      .onAddedToJob()
      .pipe(switchMap(() => afterAddedToJob))
      .subscribe();

    this.uploadRef = uploadRef;
  }

  setJobFolderCopy(oldJobId: number, fileNames: string[], afterAddedToJob: Observable<unknown> = EMPTY) {
    const messages: FileUploadMessage[] = fileNames.map((name) => ({
      type: FileUploadEventType.UploadFinish,
      id: name,
      name,
      size: 0,
      fileNames: [name],
    }));

    const progress$: Observable<FileUploadMessage[]> = of(messages);
    const uploadRef = new UploadRef(progress$, this.copyJobFilesToJobFn(oldJobId));

    uploadRef
      .onAddedToJob()
      .pipe(switchMap(() => afterAddedToJob))
      .subscribe();

    this.uploadRef = uploadRef;
  }

  private uploadFile(file: File): Observable<FileUploadMessage> {
    const messageBase: UploadMessageBase = {
      id: uploadId(file),
      name: file.name,
      size: file.size,
    };

    const upload$ = this.jobFilesService.uploadUserFile(file).pipe(
      map((event) => this.progressMessage(event, messageBase)),
      filter((event) => event !== null),
      share(),
    );

    const [important$, nonImportant$] = partition(upload$, (message) => this.isImportant(message));

    return merge(important$, nonImportant$.pipe(throttleTime(PERCENT_REPORT_INTERVAL)));
  }

  private progressMessage(event: HttpEvent<{ names: string[] }>, messageBase: UploadMessageBase): FileUploadMessage | null {
    /* New upload started */
    if (event.type === HttpEventType.Sent) {
      return {
        ...messageBase,
        type: FileUploadEventType.UploadStart,
      };
    }

    if (event.type === HttpEventType.UploadProgress) {
      const percentDone = typeof event.total === 'number' ? Math.round((100 * event.loaded) / event.total) : 0;
      return {
        ...messageBase,
        type: FileUploadEventType.UploadProgress,
        done: event.loaded,
        percentDone,
      };
    }

    if (event.type === HttpEventType.Response) {
      return {
        ...messageBase,
        type: FileUploadEventType.UploadFinish,
        fileNames: notNullOrDefault(event.body?.names, []),
      };
    }

    return null;
  }

  private uploadProgress(): OperatorFunction<FileUploadMessage, FileUploadMessage[]> {
    return pipe(
      scan((acc, msg) => acc.set(msg.id, msg), new Map<string, FileUploadMessage>()),
      map((acc) => [...acc.values()]),
    );
  }

  private waitingMessages(file$: Observable<File>): Observable<UploadWaitingMessage> {
    return file$.pipe(
      map((file) => ({
        type: FileUploadEventType.UploadWaiting,
        id: uploadId(file),
        name: this.sanitize.sanitizeFileName(file.name),
        size: file.size,
      })),
    );
  }

  private addUserFilesToJobFn(): (jobId: number, fileNames: string[]) => Observable<Job> {
    return (jobId, fileNames) => this.jobFilesService.moveUserFilesToJob(jobId, fileNames);
  }

  private addFtpFilesToJobFn(basePath: string[]): (jobId: number, fileNames: string[]) => Observable<Job> {
    return (jobId, fileNames) =>
      this.jobFilesService.copyFtpFilesToJob(
        jobId,
        fileNames.map((name) => [...basePath, name]),
      );
  }

  private copyJobFilesToJobFn(oldJobId: number): (newJobId: number, fileNames: string[]) => Observable<Job> {
    return (newJobId) => this.jobFilesService.copyJobFilesToJobFiles(oldJobId, newJobId);
  }
}
