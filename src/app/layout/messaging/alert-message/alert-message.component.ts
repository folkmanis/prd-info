import { Input, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Message, FsOperations, JobMessageActions, JobFtpUpdate } from 'src/app/interfaces';

const FS_ACTIONS: {
  operation: FsOperations;
  action: string;
}[] = [
    { operation: 'addDir', action: 'Izveidots folderis' },
    { operation: 'add', action: 'Jauns fails' },
    { operation: 'change', action: 'Mainīts fails' },
    { operation: 'unlink', action: 'Izdzēsts fails' },
  ];

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertMessageComponent<T extends JobMessageActions> implements OnInit {

  @Input()
  set message(value: Message<T>) {
    this.date = value.timestamp;

    this.action = value.module === 'jobs' && value.data.action === 'ftpUpload' && FS_ACTIONS.find(act => act.operation === value.data.operation)?.action || '';
    this.description = value.module === 'jobs' && value.data.action === 'ftpUpload' && (value.data as JobFtpUpdate).path.join('/') || '';
    this.unread = !value.seen;
  }

  date: Date;

  action: string;

  description: string;

  unread = false;

  constructor() { }

  ngOnInit(): void {
  }

}
