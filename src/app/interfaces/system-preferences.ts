import { z } from 'zod';
import {
  JobsSettingsSchema,
  KastesSettingsSchema,
  PaytraqSettingsSchema,
  SystemSettingsSchema,
  TransportationSettingsSchema,
} from './module-settings';

export const SystemPreferencesSchema = z.object({
  system: SystemSettingsSchema,
  kastes: KastesSettingsSchema,
  jobs: JobsSettingsSchema,
  paytraq: PaytraqSettingsSchema,
  transportation: TransportationSettingsSchema,
});
export type SystemPreferences = z.infer<typeof SystemPreferencesSchema>;
