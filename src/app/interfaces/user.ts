export interface User {
    username: string;
    name: string;
    password: string;
    admin: boolean;
    last_login: Date;
    preferences: UserPreferences;
}

export interface UserPreferences {
    customers: string[];
    modules: string[];
}

export interface UserModule {
    value: string;
    name: string;
    description: string; // Garais apraksts
    route: string;
    moduleClass: string;
    childMenu?: Partial<UserModule>[];
}
