import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable, Subject, finalize } from 'rxjs';
import { cacheWithUpdate } from 'src/app/library/rxjs';
import { FilesizePipe } from 'prd-cdk';
import { FileDropDirective } from '../library/directives/file-drop.directive';
import { XmfUploadProgress } from './interfaces/xmf-upload-progress';
import { XmfUploadService } from './services/xmf-upload.service';
import { TabulaComponent } from './tabula/tabula.component';

@Component({
  selector: 'app-xmf-upload',
  templateUrl: './xmf-upload.component.html',
  styleUrls: ['./xmf-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, FilesizePipe, AsyncPipe, MatProgressBarModule, FileDropDirective, TabulaComponent, MatButtonModule],
})
export class XmfUploadComponent {
  private historyUpdate$ = new Subject<XmfUploadProgress>();

  busy = signal(false);

  history$: Observable<XmfUploadProgress[]> = this.uploadService.getHistory().pipe(cacheWithUpdate(this.historyUpdate$, (o1, o2) => o1._id === o2._id));

  file: File | null = null;

  constructor(private uploadService: XmfUploadService) {}

  onFileSelected(ev: any): void {
    this.setFile(ev.target.files[0]);
  }

  onFileDropped(ev: FileList): void {
    this.setFile(ev.item(0));
  }

  onUpload(): void {
    this.busy.set(true);
    const formData: FormData = new FormData();
    formData.append('archive', this.file, this.file.name);

    this.uploadService
      .postFile(formData)
      .pipe(
        finalize(() => {
          this.busy.set(false);
          this.file = null;
        }),
      )
      .subscribe((record) => {
        this.historyUpdate$.next(record);
      });
  }

  private setFile(file: File): void {
    if (this.uploadService.validateFile(file)) {
      this.file = file;
    }
  }
}
