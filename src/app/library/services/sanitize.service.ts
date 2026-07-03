import { Service } from '@angular/core';
import sanitize from 'sanitize-filename';

@Service()
export class SanitizeService {
  constructor() {}

  sanitizeFileName(s: string): string {
    if (typeof s !== 'string') {
      return 'unknown';
    }
    s = s
      .trim()
      .normalize('NFKD')
      .replace(/[\u0300-\u036F]/g, '');
    return sanitize(s);
  }
}
