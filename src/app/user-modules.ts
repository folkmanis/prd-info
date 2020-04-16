import { UserModule } from './library/classes/user-module-interface';

export const USER_MODULES: UserModule[] = [
    { value: 'xmf-search', name: 'XMF arhīvs', description: 'Meklētājs XMF arhīva datubāzē', route: 'xmf-search', moduleClass: 'XmfSearchModule' },
    { value: 'xmf-upload', name: 'Pievienot XMF arhīvu', description: 'XFM arhīva jaunināšana', route: 'xmf-upload', moduleClass: 'XmfUploadModule' },
    {
        value: 'jobs', name: 'Darbi', description: 'Ražošanas darbi', route: 'jobs', moduleClass: 'JobsModule', childMenu: [
            { name: 'Formu pasūtījums', route: 'plate-job', description: 'Repro darbs' },
        ]
    },
    {
        value: 'jobs-admin', name: 'Darbu iestatījumi', description: 'Ražošanas darbu moduļa iestatījumi', route: 'jobs-admin', moduleClass: 'JobsAdmin', childMenu: [
            { name: 'Klienti', route: 'customers', description: 'Informācija par klientiem' },
            { name: 'Preces', route: 'products', description: 'Produkcija' },
        ]
    },
    {
        value: 'kastes', name: 'Pakošana kastēs', description: 'Pakošanas saraksti perforācijai', route: 'kastes', moduleClass: 'KastesModule', childMenu: [
            { name: 'Uzlīmju reģistrācija', route: 'labels', description: 'Saņemto uzlīmju reģistrācija, šķirošana un pārbaude' },
            { name: 'Pakošanas saraksts', route: 'selector', description: 'Darbs ar iepakojumiem' },
            { name: 'Saraksta pievienošana', route: 'upload', description: 'Jauna pakošanas saraksta izveide no pakošanas tabulas' },
            { name: 'Pasūtījumi', route: 'pasutijumi', description: 'Pakošanas sarakstu dzēšana, datubāzes optimizācija' },
        ]
    },
    {
        value: 'admin', name: 'Administrēšana', description: 'Sistēmas iestatījumi',
        route: 'admin', moduleClass: 'AdminModule', childMenu: [
            { name: 'Lietotāji', route: 'users', description: 'Sistēmas lietotāji: izveide, paroles maiņa, pieejamie moduļi' },
            { name: 'Sistēmas iestatījumi', route: 'module-preferences', description: 'Moduļu iestatījumi' },
            { name: 'Žurnāls', route: 'logfile', description: 'Sistēmas žurnāls (logfile)' },
        ]
    },
];
