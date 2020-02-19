import { Observable, BehaviorSubject, Subject, merge } from 'rxjs';
import { CollectionViewer, SelectionChange, DataSource } from '@angular/cdk/collections';
import { UserModule } from "../library/classes/user-module-interface";
import { LoginService } from '../login/login.service';
import { map } from 'rxjs/operators';

export interface SideMenuData {
    name: string;
    route: string[];
    childMenu?: SideMenuData[];
}
/**
 * Sānu izvēles MatTree datu objekts
 */
export class MenuDataSource implements DataSource<SideMenuData> {

    dataChange$ = this.loginService.modules$.pipe(
        map(mod => this.toSideMenu(mod))
    );
    constructor(
        private loginService: LoginService,
    ) { }
    /**
     * Datu struktūras obligātā funkcija. Parakstās uz lietotāja objektu
     * Mainoties lietotājam, mainās arī izvēlne
     * @param collectionViewer 
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
