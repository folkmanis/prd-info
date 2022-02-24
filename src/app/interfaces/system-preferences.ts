import { Colors } from '../kastes/interfaces';

export const MODULES = ['kastes', 'system', 'jobs', 'paytraq'] as const;

export type Modules = typeof MODULES[number];

export type ModuleSettings = KastesSettings | SystemSettings | JobsSettings | PaytraqSettings;

export interface PreferencesDbModule {
    module: Modules;
    settings: ModuleSettings;
}

export type SystemPreferencesType = { [key in Modules]: ModuleSettings; };

export abstract class SystemPreferences implements SystemPreferencesType {
    system: SystemSettings;
    kastes: KastesSettings;
    jobs: JobsSettings;
    paytraq: PaytraqSettings;
}

export interface KastesSettings {
    colors: {
        [key in Colors]: string;
    };
}

export interface SystemSettings {
    menuExpandedByDefault: boolean;
    logLevels: [number, string][];
    hostname: string;
}

export interface ProductCategory {
    category: string;
    description: string;
}

export interface JobState {
    state: number;
    description: string;
}

export interface ProductUnit {
    shortName: string;
    description: string;
    disabled: boolean;
}

export interface JobsSettings {
    productCategories: ProductCategory[];
    jobStates: JobState[];
    productUnits: ProductUnit[];
}

export interface PaytraqSettings {
    enabled: boolean;
    connectionParams?: PaytraqConnectionParams;
}

export interface PaytraqConnectionParams {
    connectUrl: string;
    connectKey: string;
    apiUrl: string;
    apiKey: string;
    apiToken: string;
    invoiceUrl: string;
}
