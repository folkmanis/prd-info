import { Observable } from 'rxjs';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { UserModule } from 'src/app/interfaces';
import { map, tap, shareReplay } from 'rxjs/operators';

export interface SideMenuData {
  name: string;
  route: string[];
  routeStr: string;
  childMenu?: SideMenuData[];
}

export class MenuDataSource implements DataSource<SideMenuData> {
  data: SideMenuData[] = [];
  dataChange$ = this.modules$.pipe(
    map((mod) => this.toSideMenu(mod)),
    tap((menu) => (this.data = menu)),
    shareReplay(1),
  );
  constructor(private modules$: Observable<UserModule[]>) {}

  connect(collectionViewer: CollectionViewer): Observable<SideMenuData[]> {
    return this.dataChange$;
  }

  disconnect() {}

  private toSideMenu(item: Partial<UserModule>[], rte: string[] = []): SideMenuData[] {
    return item.reduce((acc, val) => {
      const route = [...rte, val.route];
      const mItem: SideMenuData = {
        name: val.name,
        route,
        routeStr: route.join('/'),
        childMenu: val.childMenu?.length && this.toSideMenu(val.childMenu, route),
      };
      return [...acc, mItem];
    }, []);
  }
}
