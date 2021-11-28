import { Component, AfterViewInit, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';

import { tap, switchMap, map, distinctUntilChanged, filter, delay, takeUntil, share } from 'rxjs/operators';
import { SystemPreferencesService } from 'src/app/services';
import { SystemSettings, UserModule } from 'src/app/interfaces';
import { MenuDataSource, SideMenuData } from './menu-datasource';
import { DestroyService, log } from 'prd-cdk';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent implements OnInit {

  treeControl = new NestedTreeControl<SideMenuData>(node => node.childMenu);
  dataSource = new MenuDataSource(this.systemPreferencesService.modules$);

  activeRoute: string;

  hasChild = (_: number, node: SideMenuData) => node.childMenu?.length > 0;

  constructor(
    private systemPreferencesService: SystemPreferencesService,
    private destroy$: DestroyService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.dataSource.dataChange$.pipe(
      tap(() => this.treeControl.dataNodes = this.dataSource.data),
      switchMap(() => this.systemPreferencesService.preferences$),
      map(pref => pref.system.menuExpandedByDefault),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    )
      .subscribe(expand => this.expandMenu(expand));

    this.systemPreferencesService.activeModules$.pipe(
      takeUntil(this.destroy$),
    )
      .subscribe(mod => this.setActiveRoute(mod));
  }

  private expandMenu(expand: boolean) {
    if (expand) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
    this.changeDetector.markForCheck();
  }

  private setActiveRoute(modules: UserModule[]): void {
    this.activeRoute = modules.map(mod => mod.route).join('/');
    this.changeDetector.markForCheck();
  }

}
