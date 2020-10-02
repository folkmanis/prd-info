import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class FileUploadService {

  constructor(
    private prdApi: PrdApiService,
  ) { }

  uploadFiles(id: number, files?: File[]): Observable<void> {
    console.log(id, ...files.map(file => file.name));
    if (!id || files?.length < 1) { return of(); }
    const jobFiles = files.map(file => ({ file, jobId: id }));

    of(...jobFiles).pipe(
      mergeMap(({ jobId, file }) => this.uploadFile(jobId, file), 2)
    ).subscribe();
    return of();
  }

  private uploadFile(jobId: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('fileUpload', file, file.name);
    return this.prdApi.jobs.fileUpload(jobId, formData);
  }
}
