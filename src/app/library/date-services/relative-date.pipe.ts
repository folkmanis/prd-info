import { Pipe, PipeTransform, inject } from '@angular/core';
import { DateUtilsService } from './date-utils.service';

@Pipe({
  name: 'relativeDate',
  pure: true,
  standalone: true,
})
export class RelativeDatePipe implements PipeTransform {
  private dateUtils = inject(DateUtilsService);

  transform(value: Date | string | number, strict?: 'strict'): unknown {
    const params = {
      strict: !!strict,
    };
    return this.dateUtils.relative(value, params);
  }
}
