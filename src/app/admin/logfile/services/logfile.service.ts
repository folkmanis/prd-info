import { inject, Injectable, Signal } from '@angular/core';
import { LogfileApiService } from './logfile-api.service';
import { LogQueryFilter } from './logfile-record';

@Injectable({
  providedIn: 'root',
})
export class LogfileService {
  #api = inject(LogfileApiService);

  getLogfileResource(filterSignal: Signal<LogQueryFilter | null>) {
    return this.#api.logResource(filterSignal);
  }

  getDatesGroupResource(level: Signal<number | null>) {
    return this.#api.datesGroupsResource(level);
  }
}
