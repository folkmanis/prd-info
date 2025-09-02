import { httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { parse } from 'date-fns';
import { LogRecordSchema } from 'src/app/admin/logfile/services/logfile-record';
import { getAppParams } from 'src/app/app-params';
import { ValidatorService } from 'src/app/library';
import { HttpOptions, httpResponseRequest } from 'src/app/library/http';

@Injectable({
  providedIn: 'root',
})
export class LogfileApiService {
  #path = getAppParams().apiPath + 'logging/';
  #validator = inject(ValidatorService);

  logResource(filter: Signal<Record<string, any> | null>) {
    return httpResource(
      () => {
        const params = filter();
        if (params === null) {
          return undefined;
        } else {
          return httpResponseRequest(this.#path, new HttpOptions(params));
        }
      },
      {
        parse: this.#validator.arrayValidatorFn(LogRecordSchema),
      },
    );
  }

  datesGroupsResource(level: Signal<number | null>) {
    return httpResource(
      () => {
        if (typeof level() !== 'number') {
          return undefined;
        } else {
          return httpResponseRequest(this.#path + 'dates-groups', new HttpOptions({ level: level() }));
        }
      },
      {
        parse: (dates: string[]) => dates.map((date) => parse(date, 'y-MM-dd', 0)),
        defaultValue: [],
      },
    );
  }
}
