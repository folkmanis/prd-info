import { FormGroup, Validators, ValidatorFn, AsyncValidatorFn, ValidationErrors, AbstractControl, FormControl } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersService } from './users.service';

export class Validator {
    static password(): ValidatorFn {
        return Validators.compose([Validators.required, Validators.minLength(3)]);
    }

    static username(): ValidatorFn {
        return Validators.compose([Validators.required, Validators.minLength(3), usernamePatternValidator]);
    }

    static usernameAsync(usersService: UsersService): AsyncValidatorFn {
        return Validators.composeAsync([existingUsernameValidator(usersService)]);
    }

    static passwordEqual(password1: string, password2: string): ValidatorFn {
        return (control: FormGroup): ValidationErrors | null => {
            const p1 = control.get(password1);
            const p2 = control.get(password2);
            const error = p1.value !== p2.value ? { notEqual: 'Parolēm jāsakrīt' } : null;
            p2.setErrors(error);
            return error;
        };
    }
}

function usernamePatternValidator(control: AbstractControl): ValidationErrors {
    const val: string = control.value || '';
    if (val.match(/ /)) {
        return { symbol: 'Atstarpi nedrīkst izmantot' };
    }
    return null;
}

function existingUsernameValidator(usersService: UsersService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => usersService.validateUsername(control.value).pipe(
            map(valid => valid ? null : { existing: 'Esošs lietotājvārds' })
        );
}
