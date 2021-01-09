import { UserModule } from 'src/app/interfaces';

export const USER_MODULES: UserModule[] = [
    { name: 'XMF arhīvs', description: 'Meklētājs XMF arhīva datubāzē', route: 'xmf-search' },
    { name: 'Pievienot XMF arhīvu', description: 'XFM arhīva jaunināšana', route: 'xmf-upload' },
    {
        name: 'Darbi', description: 'Ražošanas darbi', route: 'jobs', childMenu: [
            { name: 'Jauns repro pasūtījums', route: 'new', description: 'Izveidot jaunu repro darbu' },
            { name: 'Repro rēķini', route: 'plate-invoice', description: 'Repro aprēķini' },
        ]
    },
    {
        name: 'Darbu iestatījumi', description: 'Ražošanas darbu moduļa iestatījumi', route: 'jobs-admin', childMenu: [
            { name: 'Klienti', route: 'customers', description: 'Informācija par klientiem' },
            { name: 'Preces', route: 'products', description: 'Produkcija' },
        ]
    },
    {
        name: 'Pakošana kastēs', description: 'Pakošanas saraksti perforācijai', route: 'kastes', childMenu: [
            { name: 'Pakošanas saraksts', route: 'selector', description: 'Darbs ar iepakojumiem' },
            { name: 'Saraksta pievienošana', route: 'upload', description: 'Jauna pakošanas saraksta izveide no pakošanas tabulas' },
            { name: 'Saraksta labošana', route: 'edit', description: 'Pakošanas saraksta un sadalījuma pa kastēm labošana' },
            { name: 'Pasūtījumi', route: 'pasutijumi', description: 'Pakošanas sarakstu dzēšana, datubāzes optimizācija' },
        ]
    },
    {
        name: 'Administrēšana', description: 'Sistēmas iestatījumi', route: 'admin', childMenu: [
            { name: 'Lietotāji', route: 'users', description: 'Sistēmas lietotāji: izveide, paroles maiņa, pieejamie moduļi' },
            { name: 'Sistēmas iestatījumi', route: 'module-preferences', description: 'Moduļu iestatījumi' },
            { name: 'Žurnāls', route: 'logfile', description: 'Sistēmas žurnāls (logfile)' },
        ]
    },
];
