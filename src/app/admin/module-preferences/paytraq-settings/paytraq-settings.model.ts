import { applyWhen, disabled, required, SchemaPathTree } from '@angular/forms/signals';
import { PaytraqSettingsSchema } from 'src/app/interfaces';
import { z } from 'zod';

const PaytraqConnectionParamsModelSchema = z.object({
  connectUrl: z.string(),
  connectKey: z.string(),
  apiUrl: z.string(),
  apiKey: z.string(),
  apiToken: z.string(),
  invoiceUrl: z.string(),
});

export const PaytraqSettingsModelSchema = z.codec(
  PaytraqSettingsSchema,
  z.object({
    enabled: z.boolean(),
    connectionParams: PaytraqConnectionParamsModelSchema,
  }),
  {
    decode: (value) => ({
      ...value,
      connectionParams: value.connectionParams ?? {
        connectUrl: '',
        connectKey: '',
        apiUrl: '',
        apiKey: '',
        apiToken: '',
        invoiceUrl: '',
      },
    }),
    encode: ({ enabled, connectionParams }) => ({ enabled, connectionParams: enabled ? connectionParams : null }),
  },
);
export type PaytraqSettings = z.infer<typeof PaytraqSettingsModelSchema>;

export function validatePaytraqSettings(schema: SchemaPathTree<PaytraqSettings>) {
  applyWhen(
    schema.connectionParams,
    ({ valueOf }) => valueOf(schema.enabled),
    (s) => {
      required(s.apiKey);
      required(s.apiToken);
      required(s.apiUrl);
      required(s.connectKey);
      required(s.connectUrl);
      required(s.invoiceUrl);
    },
  );
  disabled(schema.connectionParams, { when: ({ valueOf }) => valueOf(schema.enabled) === false });
}
