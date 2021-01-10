import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBase, HttpOptions } from 'src/app/library';
import { KastesJob, KastesJobResponse, Veikals } from 'src/app/interfaces';

export class KastesOrdersApi extends ApiBase<KastesJob> {
  updateVeikali(id: number, veikali: Veikals[]): Observable<number> {
    return this.http.post<KastesJobResponse>(this.path + id + '/veikali', { veikali }, new HttpOptions())
      .pipe(
        map(resp => resp.modifiedCount || 0),
      );
  }

}
