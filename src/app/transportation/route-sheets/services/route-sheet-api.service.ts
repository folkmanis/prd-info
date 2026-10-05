import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom, map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { pluckDeletedCount } from 'src/app/interfaces';
import {
  cacheable,
  httpFilter,
  httpFilterSignal,
  httpParams,
  httpResponseRequest,
  NETWORK_ERROR,
  validateAsync,
  ValidationResult,
  ValidationResultSchema,
  validatorFn,
} from 'src/app/library';
import {
  CalculatedDistance,
  CalculatedDistanceSchema,
  DistanceRequest,
  DistanceRequestSchema,
  HistoricalData,
  HistoricalDataSchema,
  RouteSheet,
  RouteSheetCrateSchema,
  RouteSheetCreate,
  RouteSheetList,
  RouteSheetListSchema,
  RouteSheetQuery,
  RouteSheetQuerySchema,
  RouteSheetSchema,
  RouteSheetUpdate,
  RouteSheetUpdateSchema,
  TransportationCustomer,
  TransportationCustomerSchema,
} from '../schemas';
import { SchemaPath, validateHttp } from '@angular/forms/signals';
import { GeneralSetupModel } from '../route-sheet-edit/general-setup/general-setup.model.service';
import { RouteSheetValidationQuerySchema } from '../schemas/route-sheet-validation-query.schema';

@Service()
export class RouteSheetApiService {
  readonly #path = getAppParams('apiPath') + 'transportation/';
  #http = inject(HttpClient);

  routeSheetResource(filter: Signal<RouteSheetQuery | undefined>): HttpResourceRef<RouteSheetList[] | undefined> {
    const query = httpFilterSignal(RouteSheetQuerySchema, filter);
    return httpResource(() => httpResponseRequest(this.#path, query().cacheable()), {
      parse: validatorFn(RouteSheetListSchema.array()),
      equal: isEqual,
    });
  }

  getRouteSheets(filter: RouteSheetQuery | undefined): Promise<RouteSheetList[]> {
    const query = httpFilter(RouteSheetQuerySchema, filter);
    const response$ = this.#http.get(this.#path, query);
    return validateAsync(RouteSheetListSchema.array(), response$);
  }

  getOne(id: string): Observable<RouteSheet> {
    return this.#http.get(this.#path + id).pipe(map(validatorFn(RouteSheetSchema)));
  }

  createOne(create: RouteSheetCreate): Promise<RouteSheet> {
    const data = RouteSheetCrateSchema.encode(create);
    const response$ = this.#http.put(this.#path, data);
    return validateAsync(RouteSheetSchema, response$);
  }

  updateOne(id: string, update: RouteSheetUpdate): Promise<RouteSheet> {
    const data = RouteSheetUpdateSchema.encode(update);
    const response$ = this.#http.patch(this.#path + id, data);
    return validateAsync(RouteSheetSchema, response$);
  }

  async deleteOne(id: string): Promise<number> {
    const response$ = this.#http.delete(this.#path + id).pipe(pluckDeletedCount());
    return firstValueFrom(response$);
  }

  getCustomers(): Observable<TransportationCustomer[]> {
    return this.#http
      .get(this.#path + 'customers', cacheable())
      .pipe(map(validatorFn(TransportationCustomerSchema.array())));
  }

  async distanceRequest(request: DistanceRequest): Promise<CalculatedDistance> {
    const data = DistanceRequestSchema.encode(request);
    const response$ = this.#http
      .post(this.#path + 'distance-request', data)
      .pipe(map(validatorFn(CalculatedDistanceSchema)));
    return firstValueFrom(response$);
  }

  getDescriptions(count?: number): Observable<string[]> {
    return this.#http.get<string[]>(this.#path + 'descriptions', httpParams({ count }).cacheable());
  }

  getHistoricalDataResource(licencePlate: Signal<string | undefined>) {
    return httpResource(
      () => (licencePlate() ? httpResponseRequest(this.#path + 'historical-data/' + licencePlate()) : undefined),
      {
        parse: validatorFn(HistoricalDataSchema),
      },
    );
  }

  getHistoricalData(licencePlate: string): Observable<HistoricalData> {
    return this.#http
      .get<HistoricalData>(this.#path + 'historical-data/' + licencePlate)
      .pipe(map(validatorFn(HistoricalDataSchema)));
  }

  validateDuplicateRouteSheet(schema: SchemaPath<GeneralSetupModel>): void {
    validateHttp(schema, {
      debounce: 300,
      options: {
        parse: ValidationResultSchema.parse,
      },
      request: ({ value }) => {
        const request = RouteSheetValidationQuerySchema.encode(value());
        if (!request) {
          return undefined;
        }
        return httpResponseRequest(this.#path + 'validate', cacheable(request));
      },
      onSuccess: (response: ValidationResult) => {
        if (response.valid === true) {
          return null;
        } else {
          return {
            kind: 'duplicate',
          };
        }
      },
      onError: () => NETWORK_ERROR,
    });
  }
}
