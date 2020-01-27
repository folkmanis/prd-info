import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

import { Pasutijums } from '../services/pasutijums';
import { PasutijumiService } from '../services/pasutijumi.service';

export class TabulaDatasource extends DataSource<Pasutijums> {

    constructor(
        private pasutijumiService: PasutijumiService,
    ) {
        super();
    }

    connect(): Observable<Pasutijums[]> {
        console.log("connect")
        return this.pasutijumiService.pasutijumi;
    }

    disconnect() {
    }

    updatePas(pas: Pasutijums) {
        this.pasutijumiService.updatePasutijums(pas);
    }
}
