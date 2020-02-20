import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';

import { of, Observable, Subscription } from 'rxjs';
import { tap, switchMap, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { LoginService, SystemSettings } from '../login/login.service';
import { MenuDataSource, SideMenuData } from './menu-datasource';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent implements AfterViewInit, OnDestroy {

  constructor(
    private loginService: LoginService,
  ) { }
  treeControl = new NestedTreeControl<SideMenuData>(node => node.childMenu);
  dataSource = new MenuDataSource(this.loginService);
  hasChild = (_: number, node: SideMenuData) => !!node.childMenu && node.childMenu.length > 0;

  private changeSubs: Subscription;

  ngAfterViewInit() {
    this.changeSubs = this.loginService.sysPreferences$.pipe(
      tap(() => this.treeControl.dataNodes = this.dataSource.data),
      map(pref => <SystemSettings>pref.get('system')),
      map(pref => pref && pref.menuExpandedByDefault),
      distinctUntilChanged(),
      filter(expand => expand),
      tap(expand => expand && this.treeControl.expandAll()),
    )
      .subscribe();
  }

  ngOnDestroy() {
    this.changeSubs.unsubscribe();
  }

}
