export interface UserModule {
    value: string;
    name: string;
    description: string;
    route: string;
    moduleClass: string;
}

export const USER_MODULES: UserModule[] = [
    { value: 'xmf-search', name: 'XMF arhīvs', description: 'Meklētājs XMF arhīva datubāzē', route: 'xmf-search', moduleClass: 'XmfSearchModule' },
    { value: 'xmf-upload', name: 'Pievienot XMF arhīvu', description: 'XFM arhīva jaunināšana', route: 'xmf-upload', moduleClass: 'XmfUploadModule' },
    { value: 'kastes', name: 'Pakošana kastēs', description: 'Pakošanas saraksti perforācijai', route: 'kastes', moduleClass: 'KastesModule' },
    { value: 'user-preferences', name: 'Lietotāja iestatījumi', description: 'Lietotāja paša iestatījumi', route: 'user-preferences', moduleClass: 'UserPreferencesModule' },
];
