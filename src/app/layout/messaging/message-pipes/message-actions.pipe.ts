import { Pipe, PipeTransform } from '@angular/core';
import { FsOperations, Message } from 'src/app/interfaces';

const FS_ACTIONS: {
  operation: FsOperations;
  action: string;
}[] = [
    { operation: 'addDir', action: 'Izveidots folderis' },
    { operation: 'add', action: 'Jauns fails' },
    { operation: 'change', action: 'Mainīts fails' },
    { operation: 'unlink', action: 'Izdzēsts fails' },
  ];

@Pipe({
  name: 'messageActions',
  pure: true,
})
export class MessageActionsPipe implements PipeTransform {

  transform(value: Message): string {
    if (value.module === 'jobs' && value.data.action === 'ftpUpload') {
      return FS_ACTIONS.find(act => act.operation === value.data.operation)?.action || '';
    }
    return value.data.operation;
  }

}
