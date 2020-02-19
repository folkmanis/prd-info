import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';

import { of, Observable, Subscription } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
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
    this.changeSubs = this.dataSource.dataChange$.pipe(
      tap(data => this.treeControl.dataNodes = data),
      switchMap(() => this.loginService.sysPreferences$),
      map(pref => <SystemSettings>pref.get('system')),
      tap(pref => pref && pref.menuExpandedByDefault && this.treeControl.expandAll()),
    )
      .subscribe();
  }

  ngOnDestroy() {
    this.changeSubs.unsubscribe();
  }

}
