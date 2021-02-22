import { Pipe, PipeTransform } from '@angular/core';
import * as fileSize from 'filesize';

@Pipe({
  name: 'filesize'
})
export class FilesizePipe implements PipeTransform {
/**
 * Transforms number of bytes to human readable string
 *
 * @param value numerical value in bytes
 * @param options refer to https://filesizejs.com/
 */
  transform(value: number, options?: any): unknown {
    return fileSize(value, options);
  }

}
