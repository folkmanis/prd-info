import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private httpPathUpload = '/data/xmf-upload/';

  constructor(
    private httpClient: HttpClient,
  ) { }

  postFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('archive', file, file.name);
    return this.httpClient.post(this.httpPathUpload + 'file', formData);
  }

}
