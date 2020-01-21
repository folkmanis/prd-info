import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject, merge } from 'rxjs';
import { CollectionViewer, SelectionChange, DataSource } from '@angular/cdk/collections';
import { USER_MODULES, UserModule } from '../user-modules';
import { LoginService } from './login.service';
import { map } from 'rxjs/operators';

export interface SideMenuData {
  name: string;
  route: string[];
  childMenu?: SideMenuData[];
}

export class MenuDataSource implements DataSource<SideMenuData> {
  dataChange = new BehaviorSubject<SideMenuData[]>([]);
  get data(): SideMenuData[] { return this.dataChange.value; }

  constructor(
    private loginService: LoginService,
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<SideMenuData[]> {
    this.loginService.user$.subscribe(usr => {
      const data = usr ? this.toSideMenu(USER_MODULES.filter(mod => usr.preferences.modules.includes(mod.value))) : [];
      this.dataChange.next(data);
    }
    );
    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.dataChange.value));
  }

  disconnect() {
    this.dataChange.unsubscribe();
  }

  private toSideMenu(item: Partial<UserModule>[], rte: string[] = []): SideMenuData[] {
    return item.reduce((acc, val) => {
      const mItem: SideMenuData = { name: val.name, route: [...rte, val.route] };
      if (val.childMenu && val.childMenu.length > 0) {
        mItem.childMenu = this.toSideMenu(val.childMenu, mItem.route);
      }
      acc.push(mItem);
      return acc;
    }, []);
  }
}


@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  title$: Subject<string> = new Subject();
  dataSource: MenuDataSource;
  constructor(
    loginService: LoginService,
  ) {
    this.dataSource = new MenuDataSource(loginService);
  }
  /**
   * Uzliek virsrakstu
   * @param val Virsraksts
   */
  setTitle(val: string) {
    this.title$.next(val);
  }
  /**
   * Uzliek virsrakstu pēc moduļa nosaukuma
   * @param mod Moduļa nosaukums
   */
  setModule(mod: string) {
    this.setTitle(USER_MODULES.find(m => m.value === mod).description);
  }



}
