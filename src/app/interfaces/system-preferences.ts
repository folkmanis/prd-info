import { z } from 'zod';
import { JobsSettings, KastesSettings, PaytraqSettings, SystemSettings, TransportationSettings } from './module-settings';

export const SystemPreferences = z.object({
  system: SystemSettings,
  kastes: KastesSettings,
  jobs: JobsSettings,
  paytraq: PaytraqSettings,
  transportation: TransportationSettings,
});
export type SystemPreferences = z.infer<typeof SystemPreferences>;

export const PreferencesDbModules = z.discriminatedUnion('module', [
  z.object({
    module: z.literal('system'),
    settings: SystemSettings,
  }),
  z.object({
    module: z.literal('kastes'),
    settings: KastesSettings,
  }),
  z.object({
    module: z.literal('jobs'),
    settings: JobsSettings,
  }),
  z.object({
    module: z.literal('paytraq'),
    settings: PaytraqSettings,
  }),
  z.object({
    module: z.literal('transportation'),
    settings: TransportationSettings,
  }),
]);
export type PreferencesDbModules = z.infer<typeof PreferencesDbModules>;

export const MODULES = PreferencesDbModules.options.map((obj) => obj.shape.module.value);
// export const MODULES = SystemPreferences.keyof();
// export type Modules = z.infer<typeof MODULES>;

// export type ModuleSettings = KastesSettings | SystemSettings | JobsSettings | PaytraqSettings | TransportationSettings;

// export interface PreferencesDbModule {
//   module: Modules;
//   settings: ModuleSettings;
// }
