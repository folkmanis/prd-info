import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { PreferencesDbModule } from 'src/app/interfaces';
import { HttpOptions } from 'src/app/library/http';

@Injectable({
    providedIn: 'root'
})
export class SystemPreferencesApiService {

    private readonly path = getAppParams('apiPath') + 'preferences/';
    private http = inject(HttpClient);

    getAll(): Observable<PreferencesDbModule[]> {
        return this.http.get<PreferencesDbModule[]>(this.path, new HttpOptions().cacheable());
    }


    updateMany(data: Partial<PreferencesDbModule>[]): Observable<number> {
        return this.http.patch<number>(this.path, data, new HttpOptions());
    }


}
