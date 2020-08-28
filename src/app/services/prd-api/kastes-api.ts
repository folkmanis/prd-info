import { Observable } from 'rxjs';
import { ApiBase, HttpOptions } from 'src/app/library';

import {
    Kaste, KasteResponse,
    KastesUserPreferences, Veikals
} from 'src/app/interfaces';
import { map, mapTo } from 'rxjs/operators';


export class KastesApi extends ApiBase<Kaste> {

    getApjomi(options: { pasutijumsId: string; }): Observable<number[]> {
        return this.http.get<KasteResponse>(this.path + 'apjomi', new HttpOptions(options)).pipe(
            map(resp => resp.apjomi),
        );
    }

    getUserPreferences(): Observable<KastesUserPreferences> {
        return this.http.get<KasteResponse>(this.path + 'preferences', new HttpOptions()).pipe(
            map(resp => resp.userPreferences),
        );
    }

    setUserPreferences(prefs: Partial<KastesUserPreferences>): Observable<boolean> {
        return this.http.post(this.path + 'preferences', prefs, new HttpOptions()).pipe(
            mapTo(true),
        );
    }

    setGatavs(kaste: Pick<Kaste, '_id' | 'kaste'>, yesno: boolean): Observable<number> {
        return this.http.post<KasteResponse>(
            `${this.path}${kaste._id}/${kaste.kaste}/gatavs/${yesno ? 1 : 0}`,
            {},
            new HttpOptions())
            .pipe(
                map(resp => resp.modifiedCount)
            );
    }

    setLabel(pasutijumsId: string, kods: number | string): Observable<Kaste | undefined> {
        return this.http.post<KasteResponse>(
            this.path + 'label',
            { kods },
            new HttpOptions({ pasutijumsId })
        )
            .pipe(
                map(resp => resp.data as Kaste | undefined)
            );
    }

    putTable(veikali: Veikals[]): Observable<number> {
        return this.http.put<KasteResponse>(this.path, veikali, new HttpOptions()).pipe(
            map(resp => resp.insertedCount)
        );
    }
}
