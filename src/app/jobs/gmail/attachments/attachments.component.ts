import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSelectionList, MatListModule } from '@angular/material/list';
import { isEqual } from 'lodash-es';
import { Attachment } from '../interfaces';
import { NgFor } from '@angular/common';
import { FilesizePipe } from 'src/app/library/common';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatListModule, FilesizePipe],
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
