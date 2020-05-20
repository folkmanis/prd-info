import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UploadService } from './services/upload.service';
import { UPLOAD_STATE } from './services/xmf-upload.class';
import { tap, debounceTime, distinctUntilChanged, throttleTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-xmf-upload',
  templateUrl: './xmf-upload.component.html',
  styleUrls: ['./xmf-upload.component.css']
})
export class XmfUploadComponent implements OnInit, OnDestroy {

  fakeInput = new FormControl('');
  file: File = null;
  uploadState: UPLOAD_STATE = UPLOAD_STATE.NONE;
  subscr: Set<Subscription> = new Set();
  uploadStates = UPLOAD_STATE;
  uploadProgress$ = this.uploadService.uploadProgress$.pipe(
    distinctUntilChanged(),
    throttleTime(200),
  );

  constructor(
    private uploadService: UploadService,
  ) { }

  ngOnInit() {
    this.fakeInput.disable();
    const sub = this.uploadService.uploadState$.pipe(
      tap(st => {
        if (st & (UPLOAD_STATE.FINISHED | UPLOAD_STATE.NONE)) {
          this.fakeInput.setValue(null);
          this.uploadService.uploadProgress$.next(0);
        }
      }),
    ).subscribe(state => this.uploadState = state);
    this.subscr.add(sub);
  }
  ngOnDestroy() {
    this.subscr.forEach(sub => sub.unsubscribe());
  }

  onFileSelected(ev: any) {
    this.setFile(ev.target.files[0]);
  }

  onFileDropped(ev: FileList) {
    this.setFile(ev.item(0));
  }

  onUpload() {
    this.uploadService.uploadState$.next(UPLOAD_STATE.UPLOADING);
    const formData: FormData = new FormData();
    formData.append('archive', this.file, this.file.name);
    this.uploadService.postFile(formData).subscribe();
  }

  private setFile(fl: File) {
    if (!this.validateFile(fl)) { return; }
    this.file = fl;
    this.fakeInput.setValue(this.file.name);
    this.uploadService.uploadState$.next(UPLOAD_STATE.FILE_SELECTED);
    this.uploadService.uploadProgress$.next(0);
  }

  private validateFile(fl: File): boolean {
    const ext = fl.name.slice((Math.max(0, fl.name.lastIndexOf('.')) || Infinity) + 1);
    return ext === 'dbd';
  }

}
