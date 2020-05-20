import { XmfUploadProgress } from '../services/xmf-upload.class';

interface TabulaColumn {
    name: string;
    displayName: string;
    class: string;
}

export const TABULA_COLUMNS: TabulaColumn[] = [
    {
        name: 'started',
        displayName: 'Ielāde sākta',
        class: '',
    }, {
        name: 'finished',
        displayName: 'Ielāde pabeigta',
        class: '',
    }, {
        name: 'fileName',
        displayName: 'Faila nosaukums',
        class: '',
    }, {
        name: 'fileSize',
        displayName: 'Faila izmērs',
        class: ''
    }, {
        name: 'count.processed',
        displayName: 'Pavisam ieraksti',
        class: ''
    }, {
        name: 'count.upserted',
        displayName: 'Pievienoti ieraksti',
        class: '',
    }, {
        name: 'count.modified',
        displayName: 'Laboti ieraksti',
        class: '',
    }
];
