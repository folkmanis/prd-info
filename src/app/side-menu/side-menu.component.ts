import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';

import { SidenavService, SideMenuData } from '../login/sidenav.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent implements OnInit {

  constructor(
    private sidenavService: SidenavService,
  ) { }
  treeControl = new NestedTreeControl<SideMenuData>(node => node.childMenu);
  dataSource = this.sidenavService.dataSource;

  ngOnInit() {
    this.dataSource.data;
  }

  hasChild = (_: number, node: SideMenuData) => !!node.childMenu && node.childMenu.length > 0;

}
