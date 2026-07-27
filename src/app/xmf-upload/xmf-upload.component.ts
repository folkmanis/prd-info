import { HttpResourceRef } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { FilesizePipe } from 'prd-cdk';
import { notNullOrThrow } from '../library';
import { FileDropDirective } from '../library/directives/file-drop.directive';
import { updateCatching } from '../library/update-catching';
import { XmfUploadProgress } from './interfaces/xmf-upload-progress';
import { XmfUploadService } from './services/xmf-upload.service';
import { TabulaComponent } from './tabula/tabula.component';

@Component({
  selector: 'app-xmf-upload',
  templateUrl: './xmf-upload.component.html',
  styleUrls: ['./xmf-upload.component.scss'],
  imports: [MatCardModule, FilesizePipe, MatProgressBar, FileDropDirective, TabulaComponent, MatButton],
})
export class XmfUploadComponent {
  #uploadService = inject(XmfUploadService);

  protected busy = signal(false);
  #update = updateCatching(this.busy);

  protected history: HttpResourceRef<XmfUploadProgress[] | undefined> = this.#uploadService.getHistory();

  protected file = signal<File | null>(null);

  protected onFileSelected({ target }: Event): void {
    const input = target as HTMLInputElement;
    const files = input.files;

    if (!files?.length) {
      return;
    }
    this.#setFile(files[0]);
  }

  protected onFileDropped(ev: FileList): void {
    const file = notNullOrThrow(ev.item(0), 'Filelist empty');
    this.#setFile(file);
  }

  async onUpload() {
    this.#update(async (message) => {
      const file = notNullOrThrow(this.file(), 'Filelist empty');
      const formData: FormData = new FormData();
      formData.append('archive', file, file.name);

      await this.#uploadService.postFile(formData);
      this.history.reload();
      this.file.set(null);

      message(`Augšupielāde pabeigta`);
    });
  }

  #setFile(file: File): void {
    if (this.#uploadService.validateFile(file)) {
      this.file.set(file);
    }
  }
}
