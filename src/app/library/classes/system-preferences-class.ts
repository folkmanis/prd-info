export interface ModulePreferences {
    module: string,
    settings: { [key: string]: any; };
}

export interface SystemPreferences extends Array<ModulePreferences> { }

export class KastesPreferences implements ModulePreferences {
    module: string;
    settings: KastesSettings;
}

export interface KastesSettings {
    colors: {
        yellow: string;
        rose: string;
        white: string;
    }
}