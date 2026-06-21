import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { z } from 'zod';
import { ValidationError } from './validation-error.class';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  validate<V>(schema: z.ZodType<V>, data: unknown): z.infer<typeof schema> {
    return this.#parse(schema, data);
  }

  validateId(id: unknown): string {
    return this.validate(z.string().regex(/^[a-f\d]{24}$/i, { error: (iss) => `Invalid id ${iss.input}` }), id);
  }

  validateArray<V>(schema: z.ZodType<V>, data: unknown): z.infer<typeof schema>[] {
    return this.#parse(z.array(schema), data);
  }

  validatorFn<V>(schema: z.ZodType<V>): (data: unknown) => z.infer<typeof schema> {
    return (data) => this.validate(schema, data);
  }

  arrayValidatorFn<V>(schema: z.ZodType<V>): (data: unknown) => z.infer<typeof schema>[] {
    return (data) => this.validateArray(schema, data);
  }

  async validateAsync<V>(schema: z.ZodType<V>, data$: Observable<unknown>): Promise<z.infer<typeof schema>> {
    const data = await firstValueFrom(data$);
    return this.validate(schema, data);
  }

  async validateArrayAsync<V>(schema: z.ZodType<V>, data$: Observable<unknown>): Promise<z.infer<typeof schema>[]> {
    const data = await firstValueFrom(data$);
    return this.validateArray(schema, data);
  }

  #parse<V>(schema: z.ZodType<V>, data: unknown): z.infer<typeof schema> {
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
