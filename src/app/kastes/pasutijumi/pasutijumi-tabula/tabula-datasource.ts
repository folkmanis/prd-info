import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

import { KastesJobPartial, KastesJob } from 'src/app/interfaces';
import { PasutijumiService } from '../../services/pasutijumi.service';

export class TabulaDatasource extends DataSource<KastesJobPartial> {

    constructor(
        private pasutijumiService: PasutijumiService,
    ) {
        super();
    }

    connect(): Observable<KastesJobPartial[]> {
        return this.pasutijumiService.pasutijumi$;
    }

    disconnect() {
    }

    updatePas(pas: Partial<KastesJob>): Observable<boolean> {
        return this.pasutijumiService.updateOrder(pas);
    }
}
