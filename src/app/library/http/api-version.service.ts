import { Service } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { ApiVersion } from './api-version';

@Service()
export class ApiVersionService {
  #version$ = new Subject<ApiVersion>();
  version$: Observable<ApiVersion> = this.#version$.pipe(distinctUntilChanged(this.#isEqual), shareReplay(1));

  setVersion(ver: ApiVersion): void {
    this.#version$.next(ver);
  }

  #isEqual(a: ApiVersion, b: ApiVersion): boolean {
    return a.appBuild === b.appBuild;
  }
}
