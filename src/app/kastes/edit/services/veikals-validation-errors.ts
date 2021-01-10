import { ValidationErrors } from '@angular/forms';
import { Colors } from 'src/app/interfaces';

export interface VeikalsValidationErrors extends ValidationErrors {
    diff?: {
        [key in Colors]?: number
    };
}
