import { Input, Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Inject } from '@angular/core';
import { Message, FsOperations, JobMessageActions, JobFtpUpdate } from 'src/app/interfaces';


@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertMessageComponent<T extends JobMessageActions> implements OnInit {

  @Input() message: Message<T>;

  @Output() delete = new EventEmitter<string>();


  constructor(
  ) { }

  ngOnInit(): void {
  }


}
