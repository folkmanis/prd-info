import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { concatMap, from, map, Observable, reduce } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { Job } from 'src/app/jobs';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http';
import { FileElement } from '../interfaces/file-element';
import { FileLocationTypes } from '../interfaces/file-location-types';


@Injectable({
  providedIn: 'root'
})
export class JobsFilesApiService {

  private path = getAppParams('apiPath') + 'jobs/files/';
  private transformer = inject(AppClassTransformerService);
  private http = inject(HttpClient);

  readJobFolder(path: string[]): Observable<FileElement[]> {
    return this.http.get<Record<string, any>[]>(
      this.path + 'read/job/',
      new HttpOptions({
        path: path.join('/')
      })
    ).pipe(
      map(data => this.transformer.plainToInstance(FileElement, data, { exposeDefaultValues: true }))
    );
  }

  fileUpload(jobId: number, form: FormData): Observable<HttpEvent<Job>> {
    const request = new HttpRequest(
      'PUT',
      this.path + jobId + '/upload',
      form,
      { reportProgress: true, }
    );
    return this.http.request<Job>(request);
  }

  userFileUpload(form: FormData): Observable<HttpEvent<{ names: string[]; }>> {
    const request = new HttpRequest(
      'PUT',
      this.path + 'user/upload',
      form,
      { reportProgress: true }
    );
    return this.http.request(request);
  }

  transferUserfilesToJob(jobId: number, fileNames: string[]): Observable<Job> {
    return this.http.patch<Job>(
      this.path + 'move/user/' + jobId,
      {
        fileNames
      }
    );
  }

  transferFtpFilesToJob(jobId: number, fileNames: string[][]): Observable<Job> {
    return this.http.patch<Job>(
      `${this.path}copy/ftp/${jobId}`,
      {
        files: fileNames
      }
    );
  }

  deleteUserFiles(fileNames: string[]) {
    return from(fileNames).pipe(
      concatMap(fileName => this.http.delete<{ deletedCount: number; }>(this.path + 'user/' + fileName)),
      map(resp => resp.deletedCount),
      reduce((acc, value) => acc + value, 0),
    );
  }

  async readFtp(path?: string): Promise<FileElement[]> {
    return this.transformer.toInstanceAsync(
      FileElement,
      this.http.get<Record<string, any>[]>(
        this.path + 'read/ftp',
        new HttpOptions({ path }).cacheable()
      )
    );
  }

  readDropFolders(path?: string): Observable<FileElement[]> {
    return this.http.get<Record<string, any>[]>(
      this.path + 'read/drop-folder',
      new HttpOptions({ path }).cacheable()
    ).pipe(
      map(data => this.transformer.plainToInstance(FileElement, data, { exposeDefaultValues: true }))
    );
  }

  updateFilesLocation(jobId: number): Observable<string[]> {
    return this.http.patch<{ path: string[]; }>(
      this.path + jobId + '/update-files-location',
      new HttpOptions()
    ).pipe(
      map(resp => resp.path),
    );
  }

  copyFile(srcType: FileLocationTypes, dstType: FileLocationTypes, srcPath: string, dstPath: string): Observable<number> {
    return this.http.patch<{ copied: number; }>(
      this.path + `copy/${srcType}/${dstType}`,
      {
        ['source-path']: srcPath,
        ['destination-path']: dstPath,
      },
      new HttpOptions(),
    ).pipe(
      map(resp => resp?.copied)
    );
  }


}
