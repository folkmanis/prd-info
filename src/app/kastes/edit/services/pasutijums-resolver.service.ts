import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { RetrieveFn, SimpleFormResolverService } from 'src/app/library/simple-form';
import { KastesJob } from 'src/app/interfaces';
import { PasutijumiService } from '../../services/pasutijumi.service';

@Injectable()
export class PasutijumsResolverService implements Resolve<KastesJob> {

  constructor(
    private pasService: PasutijumiService,
    private simpleResolver: SimpleFormResolverService,
  ) { }

  private retrieveFnFactory(id: number): RetrieveFn<KastesJob> {
    return () => {
      if (isNaN(id)) { return of(null); }
      return this.pasService.getOrder(id);
    };
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<KastesJob> | Observable<never> | undefined {
    const id: number = +route.paramMap.get('id');
    return this.simpleResolver.retrieve(state, this.retrieveFnFactory(id));

  }

}
