import { HttpParams, HttpHeaders, HttpContext, HttpContextToken, HttpClientCommonOptions } from '@angular/common/http';

export function cacheable(
  httpOptionsOrParameters?: HttpOptions | ConstructorParameters<typeof HttpOptions>[0],
): HttpOptions {
  if (httpOptionsOrParameters instanceof HttpOptions) {
    return httpOptionsOrParameters.cacheable();
  }
  return new HttpOptions(httpOptionsOrParameters).cacheable();
}

export function httpParams(httpOptionsOrParameters?: ConstructorParameters<typeof HttpOptions>[0]): HttpOptions {
  return new HttpOptions(httpOptionsOrParameters);
}

export class HttpOptions implements HttpClientCommonOptions {
  headers?: HttpHeaders;
  params: HttpParams;
  context? = new HttpContext();

  constructor(par: string | HttpParams | Record<string, unknown> = {}) {
    if (typeof par === 'string') {
      this.params = new HttpParams({ fromString: par });
      return;
    }
    if (par instanceof HttpParams) {
      this.params = par;
      return;
    }

    this.params = new HttpParams();
    Object.keys(par).forEach((key) => {
      const parameter = par[key];
      if (typeof parameter === 'string' || typeof parameter === 'number' || typeof parameter === 'boolean') {
        this.params = this.params.set(key, parameter);
      }
    });
  }

  setParam(key: string, val: string): HttpOptions {
    this.params = this.params.set(key, val);
    return this;
  }

  setHeader(name: string, value: string | string[]): HttpOptions {
    this.headers = (this.headers ?? new HttpHeaders()).set(name, value);
    return this;
  }

  setContext<T>(token: HttpContextToken<T>, value: T) {
    this.context = (this.context ?? new HttpContext()).set(token, value);
    return this;
  }

  cacheable(): HttpOptions {
    return this.setHeader('Cache', 'Ok');
  }
}
