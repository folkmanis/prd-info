import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';

import { SidenavService, SideMenuData } from '../login/sidenav.service';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent implements OnInit, AfterViewInit {

  constructor(
    private sidenavService: SidenavService,
  ) { }
  treeControl = new NestedTreeControl<SideMenuData>(node => node.childMenu);
  dataSource = this.sidenavService.dataSource;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.sidenavService.dataSource.dataChange.subscribe(data => {
      this.treeControl.dataNodes = data;
      // this.treeControl.expandAll();
    }
    );
  }

  hasChild = (_: number, node: SideMenuData) => !!node.childMenu && node.childMenu.length > 0;

}
