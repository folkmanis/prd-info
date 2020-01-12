import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pasutijums } from './pasutijums';


interface SqlResponse {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminHttpService {
  private httpPathPrefs = '/data/preferences/';
  private httpUploadTable = '/data/upload-table/';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Saņem pasūtījumu sarakstu no servera
   * @param path Relatīvais ceļš
   * Atgriež Observable masīvu no Pasūtījumu objekta
   */
  getPasutijumiHttp(path: string = 'pasnames/'): Observable<Pasutijums[]> {
    return this.http.get<Pasutijums[]>(this.httpPathPrefs + path);
  }
  /**
   * Datubāzē ievieto jaunu masūtījuma nosaukumu. Atgriež Observable no objekta ar insertId
   * @param pasName Pasūtījuma nosaukums
   * @param path Servera ceļš
   */
  postPasutijumsHttp(pasName: { pasutijums: string }, path: string = 'setpasutijums/'): Observable<{ insertId: number }> {
    return this.http.post<{ insertId: number }>(this.httpPathPrefs + path, pasName, this.httpOptions);
  }
  /**
   * Dod REST serverim komandu izdzēst vienu pasūtījumu
   * @param id pasūtījuma id
   * @param path servera ceļs
   */
  deletePasutijums(id: number, path: string = 'deletepasutijums/'): Observable<{ changedRows: number }> {
    return this.http.post<{ changedRows: number }>(this.httpPathPrefs + path, { id }, this.httpOptions);
  }
  uploadTableHttp<T>(kastes: T[]): Observable<{ affectedRows: number }> {
    return this.http.post<{ affectedRows: number }>(this.httpUploadTable + 'json', kastes);
  }

}
