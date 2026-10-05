import { SchemaPath, validateHttp } from '@angular/forms/signals';
import { z } from 'zod';
import { cacheable } from '../http';
import { httpResponseRequest } from '../http/http-resource-request';
import { ValidationResult, ValidationResultSchema } from '../http/validation-result.schema';
import { NETWORK_ERROR } from '../http/network-error';

export function validatePropertyHttp<T, Z extends z.ZodType<T, string | undefined | null>>(
  reqPath: string,
  schema: SchemaPath<T>,
  key: string,
  validatorSchema: Z,
  subpath = 'validate',
): void {
  validateHttp(schema, {
    debounce: 300,
    request: ({ value }) => {
      const request = z.encode(validatorSchema, value() as z.infer<Z>);
      if (!request) {
        return undefined;
      }
      return httpResponseRequest(`${reqPath}${subpath}/${key}`, cacheable({ value: request }));
    },
    options: {
      parse: ValidationResultSchema.parse,
    },
    onSuccess: (response: ValidationResult) => {
      if (response.valid === true) {
        return null;
      } else {
        return {
          kind: 'used',
          message: `"${response.value}" jau tiek izmantots!`,
        };
      }
    },
    onError: () => NETWORK_ERROR,
  });
}
