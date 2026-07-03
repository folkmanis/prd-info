import { httpResource } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { LogRecordSchema } from 'src/app/admin/logfile/services/logfile-record';
import { getAppParams } from 'src/app/app-params';
import { ValidatorService } from 'src/app/library';
import { HttpOptions, httpResponseRequest } from 'src/app/library/http';
import { z } from 'zod';

@Service()
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
      () =>
        typeof level() === 'number'
          ? httpResponseRequest(this.#path + 'dates-groups', new HttpOptions({ level: level() }))
          : undefined,
      {
        parse: this.#validator.arrayValidatorFn(z.coerce.date()),
        defaultValue: [],
      },
    );
  }
}
