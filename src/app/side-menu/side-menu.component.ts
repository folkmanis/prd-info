import { NestedTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { StoreState, SystemSettings } from 'src/app/interfaces';
import { getMenuModules, getModulePreferences } from 'src/app/selectors';
import { MenuDataSource, SideMenuData } from './menu-datasource';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent implements AfterViewInit, OnDestroy {

  constructor(
    private store: Store<StoreState>,
  ) { }

  treeControl = new NestedTreeControl<SideMenuData>(node => node.childMenu);
  dataSource = new MenuDataSource(
    this.store.select(getMenuModules)
  );
  private changeSubs: Subscription;

  hasChild = (_: number, node: SideMenuData) => !!node.childMenu && node.childMenu.length > 0;

  ngAfterViewInit() {
    this.changeSubs = this.dataSource.dataChange$.pipe(
      tap(() => this.treeControl.dataNodes = this.dataSource.data),
      switchMap(() => this.store.select(getModulePreferences, { module: 'system' })),
      map((pref: SystemSettings) => pref && pref.menuExpandedByDefault),
      filter(expand => expand),
      tap(expand => expand && this.treeControl.expandAll()),
    )
      .subscribe();
  }

  ngOnDestroy() {
    this.changeSubs.unsubscribe();
  }

}
