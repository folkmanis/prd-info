import { HttpResourceRef } from '@angular/common/http';
import { inject, Resource, Service, Signal } from '@angular/core';
import { toFilterSignal } from 'src/app/library';
import { withPreviousValue } from 'src/app/library/signals';
import { LogfileApiService } from './logfile-api.service';
import { LogFilter } from './logfile-record';

@Service()
export class LogfileService {
  #api = inject(LogfileApiService);

  getLogfileResource(filter: Signal<LogFilter | undefined>) {
    return this.#api.logResource(toFilterSignal(filter));
  }

  getDatesGroupSnapshot(level: Signal<number>): Resource<Date[]> {
    const dates = this.getDatesGroupResource(level);
    return withPreviousValue(dates);
  }

  getDatesGroupResource(level: Signal<number>): HttpResourceRef<Date[]> {
    return this.#api.datesGroupsResource(level);
  }
}
