import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { InjectionToken, Inject, Optional, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';


export const BREAKPOINTS = ['small', 'medium', 'large', 'handset'] as const;

export type AppBreakpoints = typeof BREAKPOINTS[number];

export interface MediaBreakpoints {
  small: string;
  medium: string;
};

export interface ToolbarHeight {
  desktop: number,
  mobile: number,

}

export const TOOLBAR_HEIGHT = new InjectionToken<ToolbarHeight>('TOOLBAR_HEIGHT', {
  factory: () => ({
    desktop: 64,
    mobile: 56,
  })
});


export const MEDIA_BREAKPOINTS = new InjectionToken<MediaBreakpoints>('MEDIA_BREAKPOINTS', {
  factory: () => ({
    small: '700px',
    medium: '1000px',
  })
});


@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private readonly breakpoints: { [key in AppBreakpoints]: string | string[] };

  isHandset$: Observable<boolean>;
  isSmall$: Observable<boolean>;
  isMedium$: Observable<boolean>;
  isLarge$: Observable<boolean>;

  toolbarHeight$: Observable<number>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    @Inject(MEDIA_BREAKPOINTS) breakpts: MediaBreakpoints,
    @Inject(TOOLBAR_HEIGHT) toolbarHeight: ToolbarHeight,
  ) {
    this.breakpoints = {
      small: `(max-width: ${breakpts.small})`,
      medium: [
        `(max-width: ${breakpts.medium})`,
        `(min-width: ${breakpts.small})`
      ],
      large: `(min-width: ${breakpts.medium})`,
      handset: Breakpoints.Handset,
    };

    this.isHandset$ = this.matches('handset');

    this.isSmall$ = this.matches('small');

    this.isMedium$ = this.matches('medium');

    this.isLarge$ = this.matches('large');

    this.toolbarHeight$ = this.isHandset$.pipe(
      map(mobile => mobile ? toolbarHeight.mobile : toolbarHeight.desktop)
    );

  }

  matches(matcher: AppBreakpoints): Observable<boolean> {
    return this.breakpointObserver
      .observe(this.breakpoints[matcher])
      .pipe(
        map(result => result.matches),
        shareReplay(),
      );
  }

}
