import { Observable } from 'rxjs';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { UserModule } from 'src/app/interfaces';
import { map, tap, share } from 'rxjs/operators';

export interface SideMenuData {
    name: string;
    route: string[];
    childMenu?: SideMenuData[];
}
/**
 * Sānu izvēles MatTree datu objekts
 */
export class MenuDataSource implements DataSource<SideMenuData> {

    constructor(
        private userMenu$: Observable<UserModule[]>,
    ) { }

    data: SideMenuData[] = [];
    dataChange$ = this.userMenu$.pipe(
        map(mod => this.toSideMenu(mod)),
        tap(menu => this.data = menu),
        share(),
    );
    /**
     * Datu struktūras obligātā funkcija. Parakstās uz lietotāja objektu
     * Mainoties lietotājam, mainās arī izvēlne
     * @param collectionViewer Parādāmais apgabals
     */
    connect(collectionViewer: CollectionViewer): Observable<SideMenuData[]> {
        return this.dataChange$;
    }

    disconnect() {
    }
    /**
     * Pārveido UserModule tipa objektu par izvēlnes 'koku'
     * @param item UserModule objekta daļa
     * @param rte augstākā līmeņa ceļi kā masīvs (vai tukšs augstākā līmeņa objektam)
     */
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
