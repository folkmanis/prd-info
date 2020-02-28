import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { XmfUploadResponse, XmfUploadProgress } from './xmf-upload.class';
import { map } from 'rxjs/operators';
import { HttpOptions } from 'src/app/library/http/http-options';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private httpPathUpload = '/data/xmf-upload/';

  constructor(
    private httpClient: HttpClient,
  ) { }
  /**
   * Augšuplādē failu ar papildinājumiem.
   * Atbildē saņem id kodu ar augšuplādes žurnāla numuru
   * @param file File objekts no formas
   */
  postFile(file: File): Observable<XmfUploadResponse> {
    const formData: FormData = new FormData();
    formData.append('archive', file, file.name);
    return this.httpClient.post<XmfUploadResponse>(this.httpPathUpload + 'file', formData);
  }
  /** upload darbību saraksts tabulai */
  // TODO izveidot mainīgu kā multicast
  get statusLog$(): Observable<XmfUploadProgress[]> {
    return this.getStatussHttp();
  }
  /** http darbības ar serveri */
  getStatussHttp(): Observable<XmfUploadProgress[]>;
  getStatussHttp(id: string): Observable<XmfUploadProgress>;
  getStatussHttp(id?: string): Observable<XmfUploadProgress | XmfUploadProgress[]> {
    if (id) {
      return this.httpClient.get<XmfUploadProgress>(this.httpPathUpload + 'upload-progress', new HttpOptions({ id }));
    } else {
      return this.httpClient.get<XmfUploadProgress[]>(this.httpPathUpload + 'upload-progress', new HttpOptions());
    }
  }

}
