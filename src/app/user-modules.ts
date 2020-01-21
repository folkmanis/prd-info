export interface UserModule {
    value: string;
    name: string;
    description: string; // Tiek izmantots toolbar virsrakstā
    route: string;
    moduleClass: string;
    childMenu?: Partial<UserModule>[];
}

interface ChildMenu {
    name: string;
    route: string;
}

export const USER_MODULES: UserModule[] = [
    { value: 'xmf-search', name: 'XMF arhīvs', description: 'Meklētājs XMF arhīva datubāzē', route: 'xmf-search', moduleClass: 'XmfSearchModule' },
    { value: 'xmf-upload', name: 'Pievienot XMF arhīvu', description: 'XFM arhīva jaunināšana', route: 'xmf-upload', moduleClass: 'XmfUploadModule' },
    // { value: 'kastes', name: 'Pakošana kastēs', description: 'Pakošanas saraksti perforācijai', route: 'kastes', moduleClass: 'KastesModule' },
    { value: 'user-preferences', name: 'Lietotāja iestatījumi', description: 'Lietotāja iestatījumi', route: 'user-preferences', moduleClass: 'UserPreferencesModule' },
    {
        value: 'admin', name: 'Administrēšana', description: 'Sistēmas iestatījumi', route: 'admin', moduleClass: 'AdminModule', childMenu: [
            { name: 'Lietotāji', route: 'users' }
        ]
    },
];
