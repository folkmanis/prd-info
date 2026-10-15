import { z } from 'zod';
import { ValidationError } from './validation-error.class';
import { firstValueFrom, map, Observable, of, OperatorFunction } from 'rxjs';

type ValidatorResult<T> = T extends readonly [infer S]
  ? S extends z.ZodType
    ? z.output<S>[]
    : never
  : T extends z.ZodType
    ? z.output<T>
    : never;

const IdSchema = z.string().regex(/^[a-f\d]{24}$/i, { error: (iss) => `Invalid id ${iss.input}` });

export function parse<V extends z.ZodType>(schema: V, data: unknown): z.output<typeof schema> {
  const result = z.safeParse(schema, data);
  if (result.success) {
    return result.data;
  } else {
    const err = result.error;
    // eslint-disable-next-line no-console
    console.error('Validation error:', z.treeifyError(err));
    throw new ValidationError(err);
  }
}

export function validatorFn<T extends z.ZodType | readonly [z.ZodType]>(
  schema: T,
): (data: unknown) => ValidatorResult<T> {
  if (Array.isArray(schema)) {
    return (data) => parse(z.array(schema[0]), data) as ValidatorResult<T>;
  } else {
    return (data) => parse(schema as z.ZodType, data) as ValidatorResult<T>;
  }
}

export function rxValidator<T extends z.ZodType | readonly [z.ZodType]>(
  schema: T,
): OperatorFunction<unknown, ValidatorResult<T>> {
  return map(validatorFn(schema));
}

export async function validateAsync<T extends z.ZodType | readonly [z.ZodType]>(
  schema: T,
  data$: Observable<unknown>,
): Promise<ValidatorResult<T>> {
  const s = (Array.isArray(schema) ? z.array(schema[0]) : schema) as z.ZodType;
  const data = await firstValueFrom(data$);
  return parse(s, data) as ValidatorResult<T>;
}

export function validateId(id: unknown): string {
  return parse(IdSchema, id);
}

export function rxId(id: unknown): Observable<string> {
  return of(id).pipe(rxValidator(IdSchema));
}
