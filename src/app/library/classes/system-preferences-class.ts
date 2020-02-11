export interface ModulePreferences {
    [key: string]: any;
}

export interface DbModulePreferences {
    module: string,
    settings: { [key: string]: any; };
}

export interface SystemPreferences extends Map<string, ModulePreferences> { }

export interface KastesSettings {
    colors: {
        yellow: string;
        rose: string;
        white: string;
    };
}

export interface SystemSettings extends ModulePreferences {
    menuExpandedByDefault: boolean,
}