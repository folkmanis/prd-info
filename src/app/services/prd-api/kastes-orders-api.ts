import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBase, HttpOptions } from 'src/app/library';
import { KastesOrder, CleanupResponse, OrdersResponse } from '../../interfaces/kastes-order';

export class KastesOrdersApi  extends ApiBase<KastesOrder> {
    deleteInactive(): Observable<CleanupResponse> {
      return this.http.delete<OrdersResponse>(this.path).pipe(
        map(resp => resp.deleted)
      );
    }
}
