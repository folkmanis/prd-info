import { Component, OnInit, ChangeDetectionStrategy, Input, Output, ViewChild } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Attachment } from '../interfaces';
import { isEqual } from 'lodash';
import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachmentsComponent implements OnInit {

  @ViewChild(MatSelectionList) private list: MatSelectionList;

  private _attachments: Attachment[] = [];
  @Input() set attachments(value: Attachment[]) {
    if (!value || isEqual(value, this._attachments)) return;
    this._attachments = value;
  }
  get attachments() {
    return this._attachments;
  }

  get selected(): Attachment[] | undefined {
    return this.list?.selectedOptions.selected.map(opt => opt.value);
  }

  isPdf = (name: string) => name.slice(name.lastIndexOf('.')) === '.pdf';

  constructor() { }

  ngOnInit(): void {
  }

  deselect(attachments: Attachment[]) {
    for (const attachment of attachments) {
      this.list.options.forEach(option => {
        if (option.value === attachment) {
          option.selected = false;
        }
      });

    }
  }


}
