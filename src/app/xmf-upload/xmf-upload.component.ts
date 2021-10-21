import { AfterViewInit, Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { XmfUploadService } from './services/xmf-upload.service';
import { tap, debounceTime, distinctUntilChanged, throttleTime, switchMap } from 'rxjs/operators';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { log } from 'prd-cdk';
import { XmfUploadHistory } from './interfaces/xmf-upload-history';

@Component({
  selector: 'app-xmf-upload',
  templateUrl: './xmf-upload.component.html',
  styleUrls: ['./xmf-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XmfUploadComponent implements OnInit, OnDestroy {

  progress$ = new BehaviorSubject<number>(0);

  busy$ = new Subject<boolean>();

  file: File | null = null;

  private reloadHistory$ = new Subject<XmfUploadHistory>();

  history$: Observable<XmfUploadHistory[]> = merge(
    this.reloadHistory$.pipe(
      switchMap(_ => this.uploadService.getHistory()),
    ),
    this.uploadService.getHistory(),
  );


  constructor(
    private uploadService: XmfUploadService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.progress$.complete();
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
    this.file = null;
    this.uploadService.postFile(formData, this.progress$)
      .subscribe(record => {
        this.file = null;
        this.reloadHistory$.next(record);
        this.busy$.next(false);
      });
  }

  private setFile(file: File): void {
    if (!this.uploadService.validateFile(file)) {
      return;
    }
    this.file = file;
    this.progress$.next(0);
  }


}
