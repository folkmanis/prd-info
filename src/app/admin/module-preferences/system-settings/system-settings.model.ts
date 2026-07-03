import { required, SchemaPathTree, validate } from '@angular/forms/signals';
import { nullableString } from 'src/app/library';
import { z } from 'zod';

export const SystemSettingsModelSchema = z.object({
  menuExpandedByDefault: z.boolean(),
  hostname: z.string(),
  companyName: z.string(),
  mapId: nullableString,
});
type SystemSettingsModel = z.infer<typeof SystemSettingsModelSchema>;

export function validateSystemSettings(path: SchemaPathTree<SystemSettingsModel>) {
  required(path.hostname, { message: `Jānorāda obligāti` });
  required(path.companyName, { message: `Nosaukums ir obligāts` });

  validate(path.hostname, ({ value }) => {
    try {
      new URL(value());
      return null;
    } catch {
      return {
        kind: 'url',
        message: `Nedrīga vietnes adrese`,
      };
    }
  });
}
