import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jobPath',
  pure: true,
})
export class JobPathPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (Array.isArray(value)) {
      return value.join('/');
    }
    return value;
  }
}
