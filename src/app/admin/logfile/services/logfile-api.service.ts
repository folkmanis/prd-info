import { httpResource, HttpResourceRef } from '@angular/common/http';
import { Service, Signal } from '@angular/core';
import { LogFilter, LogFilterSchema, LogRecord, LogRecordSchema } from 'src/app/admin/logfile/services/logfile-record';
import { getAppParams } from 'src/app/app-params';
import { httpFilter } from 'src/app/library';
import { httpParams, httpResponseRequest } from 'src/app/library/http';
import { z } from 'zod';

@Service()
export class LogfileApiService {
  #path = getAppParams().apiPath + 'logging/';

  logResource(filter: Signal<LogFilter | undefined>): HttpResourceRef<LogRecord[] | undefined> {
    return httpResource(
      () => {
        const params = filter();
        if (params) {
          return httpResponseRequest(this.#path, httpFilter(LogFilterSchema, params));
        } else {
          return undefined;
        }
      },
      {
        parse: LogRecordSchema.array().parse,
      },
    );
  }

  datesGroupsResource(level: Signal<number>): HttpResourceRef<Date[]> {
    return httpResource(() => httpResponseRequest(this.#path + 'dates-groups', httpParams({ level: level() })), {
      parse: z.coerce.date().array().parse,
      defaultValue: [],
    });
  }
}
