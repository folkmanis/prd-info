import { Validators, ValidatorFn, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersService} from './users.service'

export class Validator {
    static password(): ValidatorFn {
        return Validators.compose([Validators.required, Validators.minLength(2)]);
    }

    static username(): ValidatorFn {
        return Validators.compose([Validators.required, Validators.minLength(4), usernamePatternValidator]);
    }

    static usernameAsync(usersService: UsersService): AsyncValidatorFn {
        return Validators.composeAsync([existingUsernameValidator(usersService)]);
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
    return (control: AbstractControl): Observable<ValidationErrors> => {
        return usersService.validateUsername(control.value).pipe(
            map(valid => valid ? null : { existing: 'Esošs lietotājvārds' })
        );
    };
}
