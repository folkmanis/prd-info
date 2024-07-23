import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import { RouterLink } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { UserModule } from 'src/app/interfaces';
import { SystemPreferencesService } from 'src/app/services';
import { getConfig } from 'src/app/services/config.provider';
import { MenuDataSource, SideMenuData } from './menu-datasource';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatListModule, MatTreeModule, RouterLink, MatButtonModule, MatIconModule],
})
export class SideMenuComponent implements OnInit {
  private changeDetector = inject(ChangeDetectorRef);
  private expandedByDefault$: Observable<boolean> = getConfig('system', 'menuExpandedByDefault').pipe(distinctUntilChanged());
  private activeModules$ = inject(SystemPreferencesService).activeModules$.pipe(takeUntilDestroyed());

  treeControl = new NestedTreeControl<SideMenuData>((node) => node.childMenu);
  dataSource = new MenuDataSource(inject(SystemPreferencesService).modules$);
  expandAll$: Observable<[SideMenuData[], boolean]> = combineLatest([this.dataSource.dataChange$, this.expandedByDefault$]).pipe(takeUntilDestroyed());

  activeRoute: string;

  hasChild = (_: number, node: SideMenuData) => node.childMenu?.length > 0;

  ngOnInit(): void {
    this.expandAll$.subscribe((value) => this.expandAll(value));
    this.activeModules$.subscribe((mod) => this.setActiveRoute(mod));
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
    const active = this.dataSource.data.find((data) => data.routeStr === modules[0]?.route);
    this.treeControl.expand(active);
    this.activeRoute = modules.map((mod) => mod.route).join('/');
    this.changeDetector.markForCheck();
  }
}
