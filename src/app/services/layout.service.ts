import { Injectable, Inject } from '@angular/core';
import { AppParams } from '../interfaces';
import { APP_PARAMS } from '../app-params';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  toolbarHeight$: Observable<number> = this.isHandset$.pipe(
    map(mobile => mobile ? this.params.toolbarHeight.mobile : this.params.toolbarHeight.desktop)
  );

}
