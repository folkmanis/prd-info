import { concat, from, merge, Observable, OperatorFunction, pipe, Subject, timer } from 'rxjs';
import { concatMap, filter, last, map, mergeMap, mergeMapTo, scan, shareReplay, takeUntil, tap, toArray } from 'rxjs/operators';
import { FileUploadEventType, FileUploadMessage, UploadFinishMessage } from '../../interfaces/file-upload-message';


export class UploadRef {

    private readonly cancel$ = new Subject<void>();
    private readonly messages$: Observable<FileUploadMessage[]>;
    private readonly fileNames$: Observable<string[]>;
    private readonly addedToJob$ = new Subject<number>();

    constructor(
        messages$: Observable<FileUploadMessage[]>,
        private addToJobFn: (jobId: number, files: string[]) => Observable<number>,
    ) {
        this.messages$ = messages$.pipe(
            takeUntil(this.cancel$),
            shareReplay(1),
        );

        this.fileNames$ = this.messages$.pipe(
            this.uploadEventsToFilenames(),
        );
    }

    onMessages(): Observable<FileUploadMessage[]> {
        return this.cancelMessageWhen(this.messages$, this.cancel$);
    }

    addToJob(jobId: number): void {
        this.fileNames$.pipe(
            tap(() => this.cancel$.complete()),
            concatMap(files => this.addToJobFn(jobId, files)),
        ).subscribe(this.addedToJob$);
    }

    onAddedToJob(): Observable<number> {
        return this.addedToJob$.asObservable();
    }

    cancel(): void {
        this.addedToJob$.error(new Error('Upload cancelled'));
        this.cancel$.next();
        this.cancel$.complete();
        // this.addedToJob$.complete();
    }

    onCancel(): Observable<string[]> {
        return this.cancel$.pipe(
            mergeMap(() => this.fileNames$),
        );
    }

    private uploadEventsToFilenames(): OperatorFunction<FileUploadMessage[], string[]> {
        return pipe(
            mergeMap(events => from(events)),
            filter(event => event.type === FileUploadEventType.UploadFinish),
            mergeMap((event: UploadFinishMessage) => from(event.fileNames)),
            toArray(),
        );
    }

    private cancelMessageWhen(messages$: Observable<FileUploadMessage[]>, canceller$: Observable<void>): Observable<FileUploadMessage[]> {
        return merge(messages$, canceller$).pipe(
            scan((acc, messages) => messages || acc.map(msg => ({ ...msg, type: FileUploadEventType.UploadAbort })), []),
            map(messages => messages as FileUploadMessage[]),
        );
    }


}

