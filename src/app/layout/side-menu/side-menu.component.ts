import { NestedTreeControl } from '@angular/cdk/tree';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { DestroyService } from 'src/app/library/rxjs';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, pluck, takeUntil } from 'rxjs/operators';
import { UserModule } from 'src/app/interfaces';
import { SystemPreferencesService } from 'src/app/services';
import { MenuDataSource, SideMenuData } from './menu-datasource';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent implements OnInit {
  treeControl = new NestedTreeControl<SideMenuData>((node) => node.childMenu);
  dataSource = new MenuDataSource(this.systemPreferencesService.modules$);

  activeRoute: string;

  private expandedByDefault$: Observable<boolean> =
    this.systemPreferencesService.preferences$.pipe(
      pluck('system', 'menuExpandedByDefault'),
      distinctUntilChanged()
    );

  private expandAll$: Observable<[SideMenuData[], boolean]> = combineLatest([
    this.dataSource.dataChange$,
    this.expandedByDefault$,
  ]);

  hasChild = (_: number, node: SideMenuData) => node.childMenu?.length > 0;

  constructor(
    private systemPreferencesService: SystemPreferencesService,
    private destroy$: DestroyService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.expandAll$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => this.expandAll(value));

    this.systemPreferencesService.activeModules$
      .pipe(takeUntil(this.destroy$))
      .subscribe((mod) => this.setActiveRoute(mod));
  }

  private expandAll([data, expand]: [SideMenuData[], boolean]) {
    this.treeControl.dataNodes = data;
    if (expand) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
    this.changeDetector.markForCheck();
  }

  private setActiveRoute(modules: UserModule[]): void {
    const active = this.dataSource.data.find(
      (data) => data.routeStr === modules[0]?.route
    );
    this.treeControl.expand(active);
    this.activeRoute = modules.map((mod) => mod.route).join('/');
    this.changeDetector.markForCheck();
  }
}
