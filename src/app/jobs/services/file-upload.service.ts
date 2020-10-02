import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class FileUploadService {

  constructor() { }

  uploadFiles(jobId: number, files: File[]): Observable<void> {
    console.log(jobId, ...files.map(file => file.name));
    if (!jobId || files?.length < 1) { return of(); }
    return of();
  }
}
