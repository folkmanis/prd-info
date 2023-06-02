import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { LibraryModule } from '../../../../library/library.module';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-new-job-button',
    templateUrl: './new-job-button.component.html',
    styleUrls: ['./new-job-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatButtonModule,
        LibraryModule,
        MatMenuModule,
        NgIf,
        MatIconModule,
        RouterLink,
    ],
})
export class NewJobButtonComponent {

  @Output() fileList = new EventEmitter<FileList>();

  onFileSelected(event: any) {
    if (event.target?.files instanceof FileList && event.target.files.length > 0) {
      this.fileList.next(event.target.files);
    }
  }

  onFileDrop(fileList: FileList) {
    this.fileList.next(fileList);
  }



}
