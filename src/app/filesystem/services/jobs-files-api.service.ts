import { HttpClient, HttpEvent } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { concatMap, from, map, Observable, reduce } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { Job } from 'src/app/jobs';
import { validateAsync, validatorFn } from 'src/app/library';
import { cacheable, httpParams } from 'src/app/library/http';
import { FileElement } from '../interfaces/file-element';
import { FileLocationTypes } from '../interfaces/file-location-types';

@Service()
export class JobsFilesApiService {
  #path = getAppParams('apiPath') + 'jobs/files/';
  #http = inject(HttpClient);

  userFileUpload(form: FormData): Observable<HttpEvent<{ names: string[] }>> {
    return this.#http.put<{ names: string[] }>(this.#path + 'user/upload', form, {
      observe: 'events',
    });
  }

  transferUserfilesToJob(jobId: number, fileNames: string[]): Observable<Job> {
    return this.#http
      .patch(this.#path + 'move/user/' + jobId, {
        fileNames,
      })
      .pipe(map(validatorFn(Job)));
  }

  transferFtpFilesToJob(jobId: number, fileNames: string[][]): Observable<Job> {
    return this.#http
      .patch(`${this.#path}copy/ftp/${jobId}`, {
        files: fileNames,
      })
      .pipe(map(validatorFn(Job)));
  }

  deleteUserFiles(fileNames: string[]) {
    return from(fileNames).pipe(
      concatMap((fileName) => this.#http.delete<{ deletedCount: number }>(this.#path + 'user/' + fileName)),
      map((resp) => resp.deletedCount),
      reduce((acc, value) => acc + value, 0),
    );
  }

  readFtp(path?: string): Observable<FileElement[]> {
    return this.#http
      .get(this.#path + 'read/ftp', httpParams({ path }).cacheable())
      .pipe(map(validatorFn(FileElement.array())));
  }

  readDropFolders(path?: string): Promise<FileElement[]> {
    const request$ = this.#http.get(this.#path + 'read/drop-folder', cacheable({ path }));
    return validateAsync(FileElement.array(), request$);
  }

  updateFilesLocation(jobId: number): Promise<Job> {
    const result$ = this.#http.patch(this.#path + jobId + '/update-files-location', {});
    return validateAsync(Job, result$);
  }

  copyFromJobToJob(srcJobId: number, dstJobId: number): Observable<Job> {
    return this.#http.put(this.#path + srcJobId + '/copy/' + dstJobId, {}).pipe(map(validatorFn(Job)));
  }

  copyFile(
    srcType: FileLocationTypes,
    dstType: FileLocationTypes,
    srcPath: string,
    dstPath: string,
  ): Observable<number> {
    const body = {
      ['source-path']: srcPath,
      ['destination-path']: dstPath,
    };
    return this.#http
      .patch<{ copied: number }>(this.#path + `copy/${srcType}/${dstType}`, body)
      .pipe(map((resp) => resp.copied));
  }
}
