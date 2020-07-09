import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

import { Pasutijums } from '../interfaces';
import { PasutijumiService } from '../services/pasutijumi.service';

export class TabulaDatasource extends DataSource<Pasutijums> {

    constructor(
        private pasutijumiService: PasutijumiService,
    ) {
        super();
    }

    connect(): Observable<Pasutijums[]> {
        return this.pasutijumiService.pasutijumi$;
    }

    disconnect() {
    }

    updatePas(pas: Partial<Pasutijums>): Observable<boolean> {
        return this.pasutijumiService.updatePasutijums(pas);
    }
}
