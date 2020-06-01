import { Injectable, Inject, ViewContainerRef } from '@angular/core';
import { AppParams } from '../interfaces';
import { APP_PARAMS } from '../app-params';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Panel } from './panel';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(
    @Inject(APP_PARAMS) private params: AppParams,
    private breakpointObserver: BreakpointObserver,
  ) { }

  private _panelMap: Map<string, Panel> = new Map();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  toolbarHeight$: Observable<number> = this.isHandset$.pipe(
    map(mobile => mobile ? this.params.toolbarHeight.mobile : this.params.toolbarHeight.desktop)
  );

  addPanel = (name: string, view: ViewContainerRef) => this._panelMap.set(name, new Panel(name, view));

  removePanel = (name: string) => this._panelMap.delete(name);

  getPanel = (name: string): Panel => this._panelMap.get(name);

  clearAllPanels = () => this._panelMap.forEach(panel => panel.clear());

}
