import { HttpResourceRequest } from '@angular/common/http';
import { HttpOptions } from './http-options';

export function httpResponseRequest(url: string, options: HttpOptions): HttpResourceRequest {
  const request: HttpResourceRequest = {
    url,
    headers: options.headers,
    context: options.context,
  };
  if (options.params) {
    request.params = options.params;
  }
  return request;
}
