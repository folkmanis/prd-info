export interface UserModule {
    value: string;
    name: string;
    description: string; // Garais apraksts
    route: string;
    moduleClass: string;
    childMenu?: Partial<UserModule>[];
}
