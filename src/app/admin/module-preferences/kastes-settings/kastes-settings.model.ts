import { pattern, SchemaPath, SchemaPathTree } from '@angular/forms/signals';
import { KastesSettingsSchema } from 'src/app/interfaces';
import { z } from 'zod';

export const KastesSettingsModelSchema = KastesSettingsSchema;
export type KastesSettingsModel = z.infer<typeof KastesSettingsModelSchema>;

export function validateKastesSettings(schema: SchemaPathTree<KastesSettingsModel>) {
  hslPattern(schema.colors.rose);
  hslPattern(schema.colors.yellow);
  hslPattern(schema.colors.white);
}

function hslPattern(schema: SchemaPath<string>) {
  pattern(schema, /^hsl\((\d{1,3}),(\d{1,3})%,(\d{1,3})%\)$/, { message: `Nederīga krāsas vērtība` });
}
