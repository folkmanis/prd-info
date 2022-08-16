import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams } from 'src/app/interfaces';

export const BREAKPOINTS = ['small', 'medium', 'large', 'handset'] as const;

export type Breakpoints = typeof BREAKPOINTS[number];



@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private readonly breakpoints: { [key in Breakpoints]: string | string[] } = {
    small: `(max-width: ${this.params.mediaBreakpoints.small})`,
    medium: [
      `(max-width: ${this.params.mediaBreakpoints.medium})`,
      `(min-width: ${this.params.mediaBreakpoints.small})`
    ],
    large: `(min-width: ${this.params.mediaBreakpoints.medium})`,
    handset: Breakpoints.Handset,
  };

  isHandset$: Observable<boolean> = this.matches('handset');

  isSmall$: Observable<boolean> = this.matches('small');

  isMedium$: Observable<boolean> = this.matches('medium');

  isLarge$: Observable<boolean> = this.matches('large');

  toolbarHeight$: Observable<number> = this.isHandset$.pipe(
    map(mobile => mobile ? this.params.toolbarHeight.mobile : this.params.toolbarHeight.desktop)
  );


  constructor(
    @Inject(APP_PARAMS) private params: AppParams,
    private breakpointObserver: BreakpointObserver,
  ) { }

  matches(matcher: Breakpoints): Observable<boolean> {
    return this.breakpointObserver
      .observe(this.breakpoints[matcher])
      .pipe(
        map(result => result.matches),
        shareReplay(),
      );
  }

}
