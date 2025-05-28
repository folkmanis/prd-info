import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { z } from 'zod/v4';
import { ValidationError } from './validation-error.class';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  validate<T, V extends Record<string, any>>(schema: z.ZodObject<V>, data: T): z.infer<typeof schema> {
    return this.#parse(schema, data);
  }

  validateArray<T, V extends Record<string, any>>(schema: z.ZodObject<V>, data: T[]): z.infer<typeof schema>[] {
    return this.#parse(z.array(schema), data);
  }

  validatorFn<T, V extends Record<string, any>>(schema: z.ZodObject<V>): (data: T) => z.infer<typeof schema> {
    return (data: T) => this.validate(schema, data);
  }

  arrayValidatorFn<T, V extends Record<string, any>>(schema: z.ZodObject<V>): (data: T[]) => z.infer<typeof schema>[] {
    return (data: T[]) => this.validateArray(schema, data);
  }

  async validateAsync<T, V extends Record<string, any>>(schema: z.ZodObject<V>, data$: Observable<T>): Promise<z.infer<typeof schema>> {
    const data = await firstValueFrom(data$);
    return this.validate(schema, data);
  }

  async validateArrayAsync<T, V extends Record<string, any>>(schema: z.ZodObject<V>, data$: Observable<T[]>): Promise<z.infer<typeof schema>[]> {
    const data = await firstValueFrom(data$);
    return this.validateArray(schema, data);
  }

  async validateStringArrayAsync(data$: Observable<string[]>): Promise<string[]> {
    const data = await firstValueFrom(data$);
    return z.array(z.string()).parse(data);
  }

  #parse<T, V extends Record<string, any>>(schema: z.Schema<V>, data: T): z.infer<typeof schema> {
    const result = schema.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      const err = result.error;
      // eslint-disable-next-line no-console
      console.error('Validation error:', z.treeifyError(err));
      throw new ValidationError(err);
    }
  }
}
