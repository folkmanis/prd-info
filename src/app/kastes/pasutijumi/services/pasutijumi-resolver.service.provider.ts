import { PasutijumiService } from '../../services/pasutijumi.service';
import { RetrieveFn, SimpleFormResolverService } from 'src/app/library/simple-form';
import { KastesJob } from 'src/app/interfaces';
import { EMPTY, Observable, of } from 'rxjs';
import { Router, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Provider } from '@angular/core';

function retrieveFnFactory(serv: PasutijumiService): RetrieveFn<KastesJob> {
    return (route: ActivatedRouteSnapshot) => {
        const id = +route.paramMap.get('id');
        return isNaN(id) ? EMPTY : serv.getOrder(id);
    };
}

export const resolverServiceFactory = (
    router: Router,
    pasServ: PasutijumiService,
) => new SimpleFormResolverService<KastesJob>(router, retrieveFnFactory(pasServ));


