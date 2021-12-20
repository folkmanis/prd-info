import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, pluck } from 'rxjs/operators';
import { Kaste, KastesUserPreferences, Veikals, VeikalsKaste, VeikalsUpload } from 'src/app/kastes/interfaces';
import { ApiBase, HttpOptions } from 'src/app/library/http';


export class KastesApi extends ApiBase<Kaste> {

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

    setLabel({ pasutijums, kods }: Pick<VeikalsKaste, 'pasutijums' | 'kods'>): Observable<VeikalsKaste | undefined> {
        const path = `${this.path}${pasutijums}/${kods}/label`;
        return this.http.patch<VeikalsKaste>(path, {}, new HttpOptions()
        ).pipe(
            catchError(_ => of(null))
        );
    }

    putTable(veikali: VeikalsUpload[]): Observable<number> {
        return this.http.put<{ modifiedCount: number; }>(this.path, veikali, new HttpOptions()).pipe(
            pluck('modifiedCount')
        );
    }

    updateVeikals(veikali: Veikals): Observable<Veikals> {
        return this.http.patch<Veikals>(this.path + 'veikals', veikali, new HttpOptions());
    }

    deleteVeikali(pasutijumsId: number): Observable<number> {
        return this.http.delete<{ deletedCount: number; }>(this.path + pasutijumsId, new HttpOptions()
        ).pipe(
            pluck('deletedCount'),
        );
    }

    parseXlsx(form: FormData): Observable<any[][]> {
        return this.http.post<any[][]>(this.path + 'parseXlsx', form);
    }
}
