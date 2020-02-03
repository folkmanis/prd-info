import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UploadService } from './services/upload.service';
import { SidenavService } from '../login/sidenav.service';

@Component({
  selector: 'app-xmf-upload',
  templateUrl: './xmf-upload.component.html',
  styleUrls: ['./xmf-upload.component.css']
})
export class XmfUploadComponent implements OnInit {

  fakeInput = new FormControl('');
  file: File = null;

  response: any;

  constructor(
    private uploadService: UploadService,
    private sidenavService: SidenavService,
  ) { }

  ngOnInit() {
    this.fakeInput.disable();
  }

  onFileSelected(ev: any) {
    this.file = ev.target.files[0];
    this.fakeInput.setValue(this.file.name);
  }

  onFileDropped(ev: FileList) {
    this.file = ev.item(0);
    this.fakeInput.setValue(this.file.name);
  }

  onUpload() {
    this.uploadService.postFile(this.file).subscribe((resp) => this.response = resp);
  }

}
