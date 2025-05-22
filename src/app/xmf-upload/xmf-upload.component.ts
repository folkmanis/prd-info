import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FilesizePipe } from 'prd-cdk';
import { Observable, Subject, from } from 'rxjs';
import { cacheWithUpdate } from 'src/app/library/rxjs';
import { notNullOrThrow } from '../library';
import { FileDropDirective } from '../library/directives/file-drop.directive';
import { XmfUploadProgress } from './interfaces/xmf-upload-progress';
import { XmfUploadService } from './services/xmf-upload.service';
import { TabulaComponent } from './tabula/tabula.component';

@Component({
  selector: 'app-xmf-upload',
  templateUrl: './xmf-upload.component.html',
  styleUrls: ['./xmf-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, FilesizePipe, AsyncPipe, MatProgressBarModule, FileDropDirective, TabulaComponent, MatButtonModule],
})
export class XmfUploadComponent {
  #uploadService = inject(XmfUploadService);
  #historyUpdate$ = new Subject<XmfUploadProgress>();

  busy = signal(false);

  history$: Observable<XmfUploadProgress[]> = from(this.#uploadService.getHistory()).pipe(cacheWithUpdate(this.#historyUpdate$, (o1, o2) => o1._id === o2._id));

  file: File | null = null;

  onFileSelected(ev: any): void {
    this.setFile(ev.target.files[0]);
  }

  onFileDropped(ev: FileList): void {
    const file = notNullOrThrow(ev.item(0), 'Filelist empty');
    this.setFile(file);
  }

  async onUpload() {
    const file = notNullOrThrow(this.file, 'Filelist empty');
    this.busy.set(true);
    const formData: FormData = new FormData();
    formData.append('archive', file, file.name);

    try {
      const result = await this.#uploadService.postFile(formData);
      this.#historyUpdate$.next(result);
    } catch (error) {
    } finally {
      this.busy.set(false);
      this.file = null;
    }
  }

  private setFile(file: File): void {
    if (this.#uploadService.validateFile(file)) {
      this.file = file;
    }
  }
}
