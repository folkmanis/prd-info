import { z } from 'zod';
import { HttpOptions, httpParams } from '../http';
import { computed, Signal } from '@angular/core';

function optionalEncode<V, P extends V | undefined, U>(
  schema: z.ZodType<V, U>,
  data: P,
): P extends undefined ? undefined : U {
  return schema.optional().encode(data) as P extends undefined ? undefined : U;
}

export function httpFilter<V, U extends ConstructorParameters<typeof HttpOptions>[0]>(
  schema: z.ZodType<V, U>,
  filter: V,
): HttpOptions {
  const params = optionalEncode(schema, filter);
  return httpParams(params);
}

export function httpFilterSignal<V, U extends ConstructorParameters<typeof HttpOptions>[0]>(
  schema: z.ZodType<V, U>,
  filter: Signal<V>,
): Signal<HttpOptions> {
  return computed(() => httpFilter(schema, filter()));
}
