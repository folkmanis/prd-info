import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { InvoicesService } from './invoices.service';
import { Invoice, InvoiceProduct, SystemPreferences } from 'src/app/interfaces';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';

interface SavedState {
  route: ActivatedRouteSnapshot;
  state: RouterStateSnapshot;
}

@Injectable({
  providedIn: 'any'
})
export class InvoiceResolverService  {

  private savedState: SavedState | undefined;

  constructor(
    private invoicesService: InvoicesService,
    private router: Router,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Invoice> {
    this.savedState = { route, state };
    const invoiceId: string = route.paramMap.get('invoiceId');
    return this.invoicesService.getInvoice(invoiceId).pipe(
      mergeMap(invoice => {
        if (invoice) {
          return of(invoice);
        } else {
          this.cancelNavigation(state);
          return EMPTY;
        }
      }),
    );
  }

  reload(): Observable<Invoice> {
    if (!this.savedState) {
      return EMPTY;
    }
    const { route, state } = this.savedState;
    return this.resolve(route, state);
  }

  private cancelNavigation(state: RouterStateSnapshot) {
    this.router.navigate(state.url.split('/').slice(0, -1));
  }

}
