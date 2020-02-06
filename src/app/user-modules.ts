import { UserModule } from './library/user-module-interface';

interface ChildMenu {
    name: string;
    description: string;
    route: string;
}

export const USER_MODULES: UserModule[] = [
    { value: 'xmf-search', name: 'XMF arhīvs', description: 'Meklētājs XMF arhīva datubāzē', route: 'xmf-search', moduleClass: 'XmfSearchModule' },
    { value: 'xmf-upload', name: 'Pievienot XMF arhīvu', description: 'XFM arhīva jaunināšana', route: 'xmf-upload', moduleClass: 'XmfUploadModule' },
    {
        value: 'kastes', name: 'Pakošana kastēs', description: 'Pakošanas saraksti perforācijai', route: 'kastes', moduleClass: 'KastesModule', childMenu: [
            { name: 'Uzlīmju reģistrācija', route: 'labels', description: 'Saņemto uzlīmju reģistrācija, šķirošana un pārbaude' },
            { name: 'Pakošanas saraksts', route: 'selector', description: 'Darbs ar iepakojumiem' },
            { name: 'Saraksta pievienošana', route: 'upload', description: 'Jauna pakošanas saraksta izveide no pakošanas tabulas' },
            { name: 'Pasūtījumi', route: 'pasutijumi', description: 'Pakošanas sarakstu dzēšana, datubāzes optimizācija' },
        ]
    },
    {
        value: 'admin', name: 'Administrēšana', description: 'Sistēmas iestatījumi', route: 'admin', moduleClass: 'AdminModule', childMenu: [
            { name: 'Lietotāji', route: 'users', description: 'Sistēmas lietotāji: izveide, paroles maiņa, pieejamie moduļi' }
        ]
    },
];
