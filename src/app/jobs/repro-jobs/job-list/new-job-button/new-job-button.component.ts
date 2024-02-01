import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { FileDropDirective } from 'src/app/library/directives/file-drop.directive';

@Component({
  selector: 'app-new-job-button',
  templateUrl: './new-job-button.component.html',
  styleUrls: ['./new-job-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RouterLink,
    FileDropDirective,
  ],
})
export class NewJobButtonComponent {
  @Output() fileList = new EventEmitter<FileList>();

  onFileSelected(event: any) {
    if (
      event.target?.files instanceof FileList &&
      event.target.files.length > 0
    ) {
      this.fileList.next(event.target.files);
    }
  }

  onFileDrop(fileList: FileList) {
    this.fileList.next(fileList);
  }
}
