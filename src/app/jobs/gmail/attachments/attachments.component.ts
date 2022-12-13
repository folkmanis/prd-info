import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatLegacySelectionList as MatSelectionList } from '@angular/material/legacy-list';
import { isEqual } from 'lodash-es';
import { Attachment } from '../interfaces';

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

  deselectAll() {
    this.list.deselectAll();
  }

}
