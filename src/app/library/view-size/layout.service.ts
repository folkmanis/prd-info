import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';


export const BREAKPOINTS = ['small', 'medium', 'large', 'handset'] as const;

export type AppBreakpoints = typeof BREAKPOINTS[number];

const TOOLBAR_HEIGHT = {
  desktop: 64,
  mobile: 56,
};

const MEDIA_BREAKPOINTS = {
  small: '700px',
  medium: '1000px',
};


@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private breakpointObserver = inject(BreakpointObserver);

  private readonly breakpoints: { [key in AppBreakpoints]: string | string[] } = {
    small: `(max-width: ${MEDIA_BREAKPOINTS.small})`,
    medium: [
      `(max-width: ${MEDIA_BREAKPOINTS.medium}) and (min-width: ${MEDIA_BREAKPOINTS.small})`,
    ],
    large: `(min-width: ${MEDIA_BREAKPOINTS.medium})`,
    handset: Breakpoints.Handset,
  };

  toolbarHeight$ = this.matches('handset').pipe(
    map(mobile => mobile ? TOOLBAR_HEIGHT.mobile : TOOLBAR_HEIGHT.desktop)
  );


  matches(matcher: AppBreakpoints): Observable<boolean> {
    return this.breakpointObserver
      .observe(this.breakpoints[matcher])
      .pipe(
        map(result => result.matches),
        shareReplay(),
      );
  }

}
