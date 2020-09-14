import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBase, HttpOptions } from 'src/app/library';
import { KastesJob, KastesJobResponse } from 'src/app/interfaces';

export class KastesOrdersApi  extends ApiBase<KastesJob> {
    deleteInactive(): Observable<number> {
      return this.http.delete<KastesJobResponse>(this.path).pipe(
        map(resp => resp.deletedCount || 0)
      );
    }

}
