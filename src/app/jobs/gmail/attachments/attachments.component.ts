import { Component, OnInit, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Attachment } from '../interfaces';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachmentsComponent implements OnInit {

  @Input() attachments: Attachment[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
