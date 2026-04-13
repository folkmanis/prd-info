import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { FileDropDirective } from 'src/app/library/directives/file-drop.directive';

@Component({
  selector: 'app-new-job-button',
  templateUrl: './new-job-button.component.html',
  styleUrls: ['./new-job-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatMenuModule, RouterLink, FileDropDirective, MatFabButton, MatIcon],
})
export class NewJobButtonComponent {
  fileList = output<FileList>();

  onFileSelected(event: any) {
    if (event.target?.files instanceof FileList && event.target.files.length > 0) {
      this.fileList.emit(event.target.files);
    }
  }

  onFileDrop(fileList: FileList) {
    this.fileList.emit(fileList);
  }
}
