import { UserModule } from 'src/app/interfaces';

export const USER_MODULES: UserModule[] = [
    { name: 'XMF arhīvs', description: 'Meklētājs XMF arhīva datubāzē', route: 'xmf-search' },
    { name: 'Pievienot XMF arhīvu', description: 'XFM arhīva jaunināšana', route: 'xmf-upload' },
    {
        name: 'Darbi', description: 'Ražošanas darbi', route: 'jobs', childMenu: [
            { name: 'Repro darbi', route: 'repro', description: 'Repro darbu saraksts' },
            { name: 'Ražošanā', route: 'products-production', description: 'Izstrādājumi ražošanā' },
        ]
    },
    {
        name: 'Aprēķini', description: 'Kalkulācijas un rēķini', route: 'calculations', childMenu: [
            { name: 'Repro rēķini', route: 'plate-invoice', description: 'Repro rēķini un pavadzīmes' },
            { name: 'Darbu cenas', route: 'job-prices', description: 'Produkcijas pārdošanas cenas' },
            { name: 'Jauns rēķins', route: 'new-invoice', description: 'Izveidot jaunu repro rēķinu' },
        ]
    },
    {
        name: 'Darbu iestatījumi', description: 'Ražošanas darbu moduļa iestatījumi', route: 'jobs-admin', childMenu: [
            { name: 'Klienti', route: 'customers', description: 'Informācija par klientiem' },
            { name: 'Preces', route: 'products', description: 'Produkcija' },
            { name: 'Materiāli', route: 'materials', description: 'Izejvielas' },
            { name: 'Iekārtas', route: 'equipment', description: 'Darba procesam izmantojamās iekārtas' },
            { name: 'Procesi', route: 'production-stages', description: 'Ražošanas procesi' }
        ]
    },
    {
        name: 'Pakošana kastēs', description: 'Pakošanas saraksti perforācijai', route: 'kastes', childMenu: [
            { name: 'Pakošanas saraksts', route: 'selector', description: 'Darbs ar iepakojumiem' },
            { name: 'Saraksta pievienošana', route: 'upload', description: 'Jauna pakošanas saraksta izveide no pakošanas tabulas' },
            { name: 'Saraksta labošana', route: 'edit', description: 'Pakošanas saraksta un sadalījuma pa kastēm labošana' },
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
