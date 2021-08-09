import { Pipe, PipeTransform } from '@angular/core';
import { Message, FsOperations, JobMessageActions, JobFtpUpdate } from 'src/app/interfaces';

@Pipe({
  name: 'messageDescription',
  pure: true,
})
export class MessageDescriptionPipe implements PipeTransform {

  transform(value: Message): string {
    return value.module === 'jobs' && value.data.action === 'ftpUpload' && value.data.path.join('/') || '';
  }

}
