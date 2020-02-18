import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';

import { SidenavService, SideMenuData } from '../login/sidenav.service';
import { of, Observable } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { LoginService, SystemSettings } from '../login/login.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent implements OnInit, AfterViewInit {

  constructor(
    private sidenavService: SidenavService,
    private loginService: LoginService,
  ) { }
  treeControl = new NestedTreeControl<SideMenuData>(node => node.childMenu);
  dataSource = this.sidenavService.dataSource;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.sidenavService.dataSource.dataChange.pipe(
      tap(data => this.treeControl.dataNodes = data),
      switchMap(() => this.loginService.sysPreferences$),
      map(pref => <SystemSettings>pref.get('system')),
      tap(pref => pref && pref.menuExpandedByDefault && this.treeControl.expandAll()),
    )
      .subscribe();
  }

  hasChild = (_: number, node: SideMenuData) => !!node.childMenu && node.childMenu.length > 0;

}
