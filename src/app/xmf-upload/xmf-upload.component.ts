import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-xmf-upload',
  templateUrl: './xmf-upload.component.html',
  styleUrls: ['./xmf-upload.component.css']
})
export class XmfUploadComponent implements OnInit {

  fileInput = new FormControl('');
  constructor() { }

  ngOnInit() {
  }

  onFileSelected(ff: any) {
    console.log(ff.target.files);
    const file = ff.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(e);
    };
    fileReader.readAsText(file);

  }

  onFileDropped(ev: FileList) {
    console.log(ev);
  }

}
