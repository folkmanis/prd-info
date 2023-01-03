import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { cacheWithUpdate } from 'prd-cdk';
import { BehaviorSubject, finalize, Observable, Subject } from 'rxjs';
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

  history$: Observable<XmfUploadProgress[]> = this.uploadService.getHistory().pipe(
    cacheWithUpdate(this.historyUpdate$, (o1, o2) => o1._id === o2._id),
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


}
