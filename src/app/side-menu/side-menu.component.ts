import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';

import { of, Observable } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { LoginService, SystemSettings } from '../login/login.service';
import { MenuDataSource, SideMenuData } from './menu-datasource';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent implements OnInit, AfterViewInit {

  constructor(
    private loginService: LoginService,
  ) { }
  treeControl = new NestedTreeControl<SideMenuData>(node => node.childMenu);
  dataSource = new MenuDataSource(this.loginService);

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.dataChange$.pipe(
      tap(data => this.treeControl.dataNodes = data),
      switchMap(() => this.loginService.sysPreferences$),
      map(pref => <SystemSettings>pref.get('system')),
      tap(pref => pref && pref.menuExpandedByDefault && this.treeControl.expandAll()),
    )
      .subscribe();
  }

  hasChild = (_: number, node: SideMenuData) => !!node.childMenu && node.childMenu.length > 0;

}
