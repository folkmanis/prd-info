import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { KastesJob } from 'src/app/interfaces';
import { RetrieveFn, SimpleFormResolverService } from 'src/app/library/simple-form';
import { PasutijumiService } from '../../services/pasutijumi.service';

interface SavedState {
  route: ActivatedRouteSnapshot;
  state: RouterStateSnapshot;
}

@Injectable()
export class PasutijumiResolverService implements Resolve<KastesJob> {

  constructor(
    private simpleResolver: SimpleFormResolverService,
    private pasutijumiService: PasutijumiService,
  ) { }

  private savedState: SavedState | undefined;

  retrieveFnFactory(id: number): RetrieveFn<KastesJob> {
    return () => {
      return isNaN(id) ? EMPTY : this.pasutijumiService.getOrder(id);
    };
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<KastesJob> | Observable<never> {
    this.savedState = { route, state };
    return this.simpleResolver.retrieve(
      state,
      this.retrieveFnFactory(+route.paramMap.get('id')),
    );
  }

  reload(): Observable<KastesJob> | Observable<never> | undefined {
    if (!this.savedState) { return EMPTY; }
    const { route, state } = this.savedState;
    return this.resolve(route, state);
  }
}
