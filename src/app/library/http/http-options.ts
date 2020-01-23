import { HttpParams, HttpHeaders } from '@angular/common/http';

export class HttpOptions {

    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    params: HttpParams = new HttpParams();
    /**
     * Objekts lietošanai kā HttpClient.get() options parametrs
     * @param par: { [key: string]: any } http query parametri
     * tiks nodoti kā ?key=value&key=value...
     */
    constructor(par: { [key: string]: any; }) {
        Object.keys(par).forEach((key) => {
            this.params = this.params.set(key, par[key]);
        });
    }
    /**
     * Pievieno vērtību params objektam
     * @param key parametrs
     * @param val vērtība
     */
    set(key: string, val: string): HttpOptions {
        this.params = this.params.set(key, val);
        return this;
    }

}
