import { SystemPreferences } from 'src/app/interfaces';
import { z } from 'zod';
import { JobsSettingsModelSchema } from './jobs-settings/jobs-settings.model';
import { KastesSettingsModelSchema } from './kastes-settings/kastes-settings.model';
import { PaytraqSettingsModelSchema } from './paytraq-settings/paytraq-settings.model';
import { SystemSettingsModelSchema } from './system-settings/system-settings.model';
import { TransportationSettingsModelSchema } from './transportation-settings/transportation-settings.model';
import { DeepPartial } from 'ts-essentials';

export const ModulePreferencesModelSchema = z.object({
  system: SystemSettingsModelSchema,
  kastes: KastesSettingsModelSchema,
  jobs: JobsSettingsModelSchema,
  paytraq: PaytraqSettingsModelSchema,
  transportation: TransportationSettingsModelSchema,
});
export type ModulePreferencesModel = z.infer<typeof ModulePreferencesModelSchema>;

export function toModel(settings: SystemPreferences): ModulePreferencesModel {
  return ModulePreferencesModelSchema.decode(settings);
}

export function toUpdate(settings: ModulePreferencesModel): DeepPartial<SystemPreferences> {
  return ModulePreferencesModelSchema.encode(settings);
}
