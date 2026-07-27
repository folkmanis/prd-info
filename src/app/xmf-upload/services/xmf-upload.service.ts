import { HttpResourceRef } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { XmfUploadProgress } from '../interfaces/xmf-upload-progress';
import { XmfArchiveUploadApiService } from './xmf-archive-upload-api.service';

@Service()
export class XmfUploadService {
  private api = inject(XmfArchiveUploadApiService);

  getHistory(): HttpResourceRef<XmfUploadProgress[] | undefined> {
    return this.api.getHistoryResource();
  }

  postFile(formData: FormData): Promise<XmfUploadProgress> {
    return firstValueFrom(this.api.uploadArchive(formData));
  }

  validateFile(fl: File): boolean {
    const ext = fl.name.slice((Math.max(0, fl.name.lastIndexOf('.')) || Infinity) + 1);
    return ext === 'dbd';
  }
}
