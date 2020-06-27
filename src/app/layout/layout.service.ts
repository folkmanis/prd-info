import { Injectable, Inject, ViewContainerRef } from '@angular/core';
import { AppParams } from '../interfaces';
import { APP_PARAMS } from '../app-params';
import { MatSidenavContent } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(
    @Inject(APP_PARAMS) private params: AppParams,
    private breakpointObserver: BreakpointObserver,
  ) { }

  isHandset$: Observable<boolean> = this.matches(Breakpoints.Handset);

  isSmall$: Observable<boolean> = this.matches(`(max-width: ${this.params.mediaBreakpoints.small})`);

  isMedium$: Observable<boolean> = this.matches([
    `(max-width: ${this.params.mediaBreakpoints.medium})`,
    `(min-width: ${this.params.mediaBreakpoints.small})`
  ]);

  isLarge$: Observable<boolean> = this.matches(`(min-width: ${this.params.mediaBreakpoints.medium})`);

  toolbarHeight$: Observable<number> = this.isHandset$.pipe(
    map(mobile => mobile ? this.params.toolbarHeight.mobile : this.params.toolbarHeight.desktop)
  );

  private matches(matcher: string | string[]): Observable<boolean> {
    return this.breakpointObserver.observe(matcher).pipe(
      map(result => result.matches),
      shareReplay(),
    );
  }

}
