import { Type } from 'class-transformer';
import { MessageData } from './message-data';

const FS_ACTIONS: {
    operation: FsOperations;
    action: string;
}[] = [
        { operation: 'addDir', action: 'Izveidots folderis' },
        { operation: 'add', action: 'Jauns fails' },
        { operation: 'change', action: 'Mainīts fails' },
        { operation: 'unlink', action: 'Izdzēsts fails' },
    ];


export type FsOperations = 'add' | 'addDir' | 'change' | 'unlink' | 'ready';

export class JobData extends MessageData {

    action: 'ftpUpload';
    operation: FsOperations;
    path: string[];

    toAction() {
        if (this.action === 'ftpUpload') {
            return FS_ACTIONS.find(act => act.operation === this.operation)?.action || '';
        }
        return '';

    }

    toDescription() {
        return this.action === 'ftpUpload' && this.path.join('/') || '';
    }

}
