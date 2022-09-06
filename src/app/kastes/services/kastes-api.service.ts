import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { KastesUserPreferences, Veikals, VeikalsKaste, VeikalsUpload } from 'src/app/kastes/interfaces';
import { HttpOptions } from 'src/app/library/http';

@Injectable({
    providedIn: 'root'
})
export class KastesApiService {

    private readonly path = getAppParams('apiPath') + 'kastes/';

    constructor(
        private http: HttpClient,
    ) {
    }

    getKastes(jobId: number): Observable<VeikalsKaste[]> {
        return this.http.get<VeikalsKaste[]>(this.path + jobId, new HttpOptions());
    }

    getVeikali(jobId: number): Observable<Veikals[]> {
        return this.http.get<Veikals[]>(this.path + 'veikali/' + jobId, new HttpOptions());
    }

    getApjomi(jobId: number): Observable<number[]> {
        return this.http.get<number[]>(this.path + jobId + '/apjomi', new HttpOptions());
    }

    getUserPreferences(): Observable<KastesUserPreferences> {
        return this.http.get<KastesUserPreferences>(this.path + 'preferences', new HttpOptions());
    }

    setUserPreferences(prefs: Partial<KastesUserPreferences>): Observable<KastesUserPreferences> {
        return this.http.patch<KastesUserPreferences>(
            this.path + 'preferences',
            prefs,
            new HttpOptions()
        );
    }

    setGatavs({ _id, kaste }: Pick<VeikalsKaste, '_id' | 'kaste'>, yesno: boolean): Observable<VeikalsKaste> {
        // `192.168.8.73:4030/data/kastes/60f9214bf0b8622f7cedccaa/0/gatavs/false`
        const path = `${this.path}${_id}/${kaste}/gatavs/${yesno}`;
        return this.http.patch<VeikalsKaste>(path, {}, new HttpOptions());
    }

    setLabel({ pasutijums, kods }: Pick<VeikalsKaste, 'pasutijums' | 'kods'>): Observable<VeikalsKaste> {
        const path = `${this.path}${pasutijums}/${kods}/label`;
        return this.http.patch<VeikalsKaste>(path, {}, new HttpOptions()
        );
    }

    putTable(veikali: VeikalsUpload[]): Observable<number> {
        return this.http.put<{ modifiedCount: number; }>(this.path, veikali, new HttpOptions()).pipe(
            map(data => data.modifiedCount)
        );
    }

    updateVeikals(veikali: Veikals): Observable<Veikals> {
        return this.http.patch<Veikals>(this.path + 'veikals', veikali, new HttpOptions());
    }

    deleteVeikali(pasutijumsId: number): Observable<number> {
        return this.http.delete<{ deletedCount: number; }>(this.path + pasutijumsId, new HttpOptions()
        ).pipe(
            map(data => data.deletedCount),
        );
    }

    parseXlsx(form: FormData): Observable<any[][]> {
        return this.http.post<any[][]>(this.path + 'parseXlsx', form);
    }
}
