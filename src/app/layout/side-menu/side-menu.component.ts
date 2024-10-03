import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { RouterLink } from '@angular/router';
import { UserModule } from 'src/app/interfaces';
import { SystemPreferencesService } from 'src/app/services';
import { configuration } from 'src/app/services/config.provider';

interface SideMenuNode {
  name: string;
  route: string[];
  routeStr: string;
  childMenu?: SideMenuNode[];
}

const TEST_MODULES = [
  { name: 'XMF arhīvs', description: 'Meklētājs XMF arhīva datubāzē', route: 'xmf-search' },
  {
    name: 'Repro darbi',
    description: 'Ražošanas darbi',
    route: 'jobs',
    childMenu: [
      { name: 'Repro darbi', route: 'repro', description: 'Repro darbu saraksts' },
      { name: 'Kopsavilkums', route: 'products-production', description: 'Izstrādājumi ražošanā' },
      { name: 'gmail', route: 'gmail', description: 'Darba izveidošana no Gmail e-pasta' },
    ],
  },
];

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatListModule, MatTreeModule, RouterLink, MatButtonModule, MatIconModule],
})
export class SideMenuComponent {
  private tree = viewChild.required(MatTree);
  private expandedByDefault = configuration('system', 'menuExpandedByDefault');

  private modules = inject(SystemPreferencesService).modules;
  private activeModules = inject(SystemPreferencesService).activeModules;

  data = computed(() => toSideMenu(this.modules()));

  activeRoute = computed(() =>
    this.activeModules()
      .map((mod) => mod.route)
      .join('/'),
  );

  childrenAccessor = (node: SideMenuNode) => node.childMenu;

  hasChild = (_: number, node: SideMenuNode) => node.childMenu?.length > 0;

  constructor() {
    effect(() => {
      if (this.expandedByDefault()) {
        this.tree().expandAll();
      } else {
        this.tree().collapseAll();
      }
    });
    effect(() => {
      const activeRoute = this.activeModules()[0]?.route;
      const activeRootItem = this.data().find((data) => data.routeStr === activeRoute);
      this.tree().expand(activeRootItem);
    });
  }
}

function toSideMenu(item: Partial<UserModule>[], rte: string[] = []): SideMenuNode[] {
  return item.reduce((acc, val) => {
    const route = [...rte, val.route];
    const mItem: SideMenuNode = {
      name: val.name,
      route,
      routeStr: route.join('/'),
      childMenu: val.childMenu && toSideMenu(val.childMenu, route),
    };
    return [...acc, mItem];
  }, []);
}
