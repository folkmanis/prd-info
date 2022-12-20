import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, map, switchMap, tap, BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { XmfUploadProgress } from './interfaces/xmf-upload-progress';
import { XmfUploadService } from './services/xmf-upload.service';

@Component({
  selector: 'app-xmf-upload',
  templateUrl: './xmf-upload.component.html',
  styleUrls: ['./xmf-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XmfUploadComponent implements OnDestroy {

  private historyUpdate$ = new Subject<XmfUploadProgress>();

  busy$ = new BehaviorSubject<boolean>(false);

  history$: Observable<XmfUploadProgress[]> = this.historyCache(
    this.uploadService.getHistory(),
    this.historyUpdate$,
  );

  file: File | null = null;

  constructor(
    private uploadService: XmfUploadService,
  ) { }

  ngOnDestroy() {
    this.busy$.complete();
  }

  onFileSelected(ev: any): void {
    this.setFile(ev.target.files[0]);
  }

  onFileDropped(ev: FileList): void {
    this.setFile(ev.item(0));
  }

  onUpload(): void {

    this.busy$.next(true);
    const formData: FormData = new FormData();
    formData.append('archive', this.file, this.file.name);

    this.uploadService.postFile(formData).pipe(
      finalize(() => {
        this.busy$.next(false);
        this.file = null;
      })
    ).subscribe(record => {
      this.historyUpdate$.next(record);
    });
  }

  private setFile(file: File): void {
    if (this.uploadService.validateFile(file)) {
      this.file = file;
    }
  }

  private historyCache(
    history$: Observable<XmfUploadProgress[]>,
    update$: Observable<XmfUploadProgress>
  ): Observable<XmfUploadProgress[]> {
    let cache: XmfUploadProgress[] = [];
    return merge(
      history$.pipe(
        tap(h => cache = h),
      ),
      update$.pipe(
        map(upd => {
          const idx = cache.findIndex(prog => prog._id === upd._id);
          if (idx > -1) {
            cache = [...cache.slice(0, idx), upd, ...cache.slice(idx + 1)];
          } else {
            cache = [upd, ...cache];
          }
          return cache;
        })
      )
    );
  }


}
