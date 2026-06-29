import { ValidationError } from '@angular/forms/signals';

export const NETWORK_ERROR: ValidationError = { kind: 'network_error', message: 'Tīkla kļūda' };
