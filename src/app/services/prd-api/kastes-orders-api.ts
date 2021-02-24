import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBase, HttpOptions } from 'src/app/library/http';
import { KastesJob, KastesJobResponse, Veikals } from 'src/app/interfaces';

export class KastesOrdersApi extends ApiBase<KastesJob> {

}
