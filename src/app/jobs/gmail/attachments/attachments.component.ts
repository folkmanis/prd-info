import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { isEqual } from 'lodash-es';
import { FilesizePipe } from 'prd-cdk';
import { Attachment } from '../interfaces';

@Component({
    selector: 'app-attachments',
    templateUrl: './attachments.component.html',
    styleUrls: ['./attachments.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatListModule, FilesizePipe]
})
export class AttachmentsComponent {
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
    return this.list?.selectedOptions.selected.map((opt) => opt.value);
  }
}
