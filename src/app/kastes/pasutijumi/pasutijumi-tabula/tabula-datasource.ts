import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

import { KastesOrder, KastesOrderPartial } from 'src/app/interfaces';
import { PasutijumiService } from '../../services/pasutijumi.service';

export class TabulaDatasource extends DataSource<KastesOrderPartial> {

    constructor(
        private pasutijumiService: PasutijumiService,
    ) {
        super();
    }

    connect(): Observable<KastesOrderPartial[]> {
        return this.pasutijumiService.pasutijumi$;
    }

    disconnect() {
    }

    updatePas(pas: Partial<KastesOrder>): Observable<boolean> {
        return this.pasutijumiService.updateOrder(pas);
    }
}
