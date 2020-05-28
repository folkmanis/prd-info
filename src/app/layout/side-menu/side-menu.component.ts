import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';

import { of, Observable, Subscription } from 'rxjs';
import { tap, switchMap, map, distinctUntilChanged, filter, delay } from 'rxjs/operators';
import { SystemPreferencesService } from 'src/app/services';
import { SystemSettings } from 'src/app/interfaces';
import { MenuDataSource, SideMenuData } from './menu-datasource';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent implements AfterViewInit, OnDestroy {

  constructor(
    private systemPreferencesService: SystemPreferencesService,
  ) { }
  treeControl = new NestedTreeControl<SideMenuData>(node => node.childMenu);
  dataSource = new MenuDataSource(this.systemPreferencesService.modules$);
  private changeSubs: Subscription;

  hasChild = (_: number, node: SideMenuData) => !!node.childMenu && node.childMenu.length > 0;

  ngAfterViewInit() {
    this.changeSubs = this.dataSource.dataChange$.pipe(
      tap(() => this.treeControl.dataNodes = this.dataSource.data),
      switchMap(() => this.systemPreferencesService.sysPreferences$),
      map(pref => pref.get('system') as SystemSettings),
      map(pref => pref && pref.menuExpandedByDefault),
      filter(expand => expand),
      tap(expand => expand && this.treeControl.expandAll()),
    )
      .subscribe();
  }

  ngOnDestroy() {
    this.changeSubs.unsubscribe();
  }

}
