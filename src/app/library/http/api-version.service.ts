import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { ApiVersion } from './api-version';

@Injectable({
  providedIn: 'root',
})
export class ApiVersionService {
  private _version$ = new Subject<ApiVersion>();
  version$: Observable<ApiVersion> = this._version$.pipe(distinctUntilChanged(this.isEqual), shareReplay(1));

  constructor() {}

  setVersion(ver: ApiVersion): void {
    this._version$.next(ver);
  }

  private isEqual(a: ApiVersion, b: ApiVersion): boolean {
    return a.appBuild === b.appBuild;
  }
}
