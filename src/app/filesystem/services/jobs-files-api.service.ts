import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { concatMap, firstValueFrom, from, map, Observable, reduce } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { Job } from 'src/app/jobs';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http';
import { FileElement } from '../interfaces/file-element';
import { FileLocationTypes } from '../interfaces/file-location-types';

@Injectable({
  providedIn: 'root',
})
export class JobsFilesApiService {
  private path = getAppParams('apiPath') + 'jobs/files/';
  private transformer = inject(AppClassTransformerService);
  private http = inject(HttpClient);

  fileUpload(jobId: number, form: FormData): Observable<HttpEvent<Job>> {
    const request = new HttpRequest('PUT', this.path + jobId + '/upload', form, { reportProgress: true });
    return this.http.request<Job>(request);
  }

  userFileUpload(form: FormData): Observable<HttpEvent<{ names: string[] }>> {
    const request = new HttpRequest('PUT', this.path + 'user/upload', form, { reportProgress: true });
    return this.http.request(request);
  }

  transferUserfilesToJob(jobId: number, fileNames: string[]): Observable<Job> {
    return this.http.patch<Job>(this.path + 'move/user/' + jobId, {
      fileNames,
    });
  }

  transferFtpFilesToJob(jobId: number, fileNames: string[][]): Observable<Job> {
    return this.http.patch<Job>(`${this.path}copy/ftp/${jobId}`, {
      files: fileNames,
    });
  }

  deleteUserFiles(fileNames: string[]) {
    return from(fileNames).pipe(
      concatMap((fileName) => this.http.delete<{ deletedCount: number }>(this.path + 'user/' + fileName)),
      map((resp) => resp.deletedCount),
      reduce((acc, value) => acc + value, 0),
    );
  }

  async readFtp(path?: string): Promise<FileElement[]> {
    return this.transformer.toInstanceAsync(FileElement, this.http.get<Record<string, any>[]>(this.path + 'read/ftp', new HttpOptions({ path }).cacheable()));
  }

  async readDropFolders(path?: string): Promise<FileElement[]> {
    const request$ = this.http.get<Record<string, any>[]>(this.path + 'read/drop-folder', new HttpOptions({ path }).cacheable());
    return this.transformer.toInstanceAsync(FileElement, request$);
  }

  async updateFilesLocation(jobId: number): Promise<Job> {
    const result$ = this.http.patch<Job>(this.path + jobId + '/update-files-location', new HttpOptions());
    return firstValueFrom(result$);
  }

  copyFromJobToJob(srcJobId: number, dstJobId: number): Observable<Job> {
    return this.http.put<Job>(this.path + srcJobId + '/copy/' + dstJobId, {}, new HttpOptions());
  }

  copyFile(srcType: FileLocationTypes, dstType: FileLocationTypes, srcPath: string, dstPath: string): Observable<number> {
    return this.http
      .patch<{ copied: number }>(
        this.path + `copy/${srcType}/${dstType}`,
        {
          ['source-path']: srcPath,
          ['destination-path']: dstPath,
        },
        new HttpOptions(),
      )
      .pipe(map((resp) => resp?.copied));
  }
}
