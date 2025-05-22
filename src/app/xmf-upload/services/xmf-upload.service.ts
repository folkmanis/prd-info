import { Injectable } from '@angular/core';
import { XmfUploadProgress } from '../interfaces/xmf-upload-progress';
import { XmfArchiveUploadApiService } from './xmf-archive-upload-api.service';

@Injectable({
  providedIn: 'root',
})
export class XmfUploadService {
  constructor(private api: XmfArchiveUploadApiService) {}

  getHistory(): Promise<XmfUploadProgress[]> {
    return this.api.getHistory();
  }

  postFile(formData: FormData): Promise<XmfUploadProgress> {
    return this.api.uploadArchive(formData);
  }

  validateFile(fl: File): boolean {
    const ext = fl.name.slice((Math.max(0, fl.name.lastIndexOf('.')) || Infinity) + 1);
    return ext === 'dbd';
  }
}
