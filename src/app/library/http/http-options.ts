import { HttpParams, HttpHeaders, HttpContext, HttpContextToken } from '@angular/common/http';

export class HttpOptions {
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  params: HttpParams = new HttpParams();
  context = new HttpContext();
  /**
   * Objekts lietošanai kā HttpClient.get() options parametrs
   *
   * @param par: { [key: string]: any } http query parametri
   * tiks nodoti kā ?key=value&key=value...
   */
  constructor(par: { [key: string]: any } = {}) {
    Object.keys(par).forEach((key) => {
      if (par[key] !== undefined) {
        this.params = this.params.set(key, par[key]);
      }
    });
  }
  /**
   * Pievieno vērtību params objektam
   *
   * @param key parametrs
   * @param val vērtība
   */
  set(key: string, val: string): HttpOptions {
    this.params = this.params.set(key, val);
    return this;
  }

  setHeader(name: string, value: string | string[]): HttpOptions {
    this.headers = this.headers.set(name, value);
    return this;
  }

  setContext<T>(token: HttpContextToken<T>, value: T) {
    this.context.set(token, value);
    return this;
  }

  cacheable(): HttpOptions {
    return this.setHeader('Cache', 'Ok');
  }
}
