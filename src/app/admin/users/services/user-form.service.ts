import { Injectable } from '@angular/core';
import { Validators, AbstractControl, ValidationErrors, AsyncValidatorFn, FormControl, FormGroup } from '@angular/forms';
import { User, UserPreferences, UserSession } from 'src/app/interfaces';
import { UsersService } from '../../services/users.service';
import { tap, Observable, of, map } from 'rxjs';
import { AppClassTransformerService } from 'src/app/library';
import { isEqual, pickBy } from 'lodash-es';

interface UserFormGroup {
    username: FormControl<string>,
    name: FormControl<string>,
    // admin: FormControl<boolean>,
    password: FormControl<string>,
    last_login: FormControl<Date>,
    userDisabled: FormControl<boolean>,
    eMail: FormControl<string>,
    preferences: FormGroup<{
        customers: FormControl<string[]>,
        modules: FormControl<string[]>,
    }>,
    // sessions: FormControl<UserSession[]>,
}


@Injectable()
export class UserFormService {

    form: FormGroup<UserFormGroup> = this.createForm();

    private initialValue: User = new User();

    get isNew(): boolean {
        return !this.initialValue?.username;
    }

    get value(): User {
        return this.transformer.plainToInstance(User, this.form.value);
    }

    get changes(): Partial<User> | undefined {
        if (this.isNew) {
            return pickBy(this.value, value => value !== null);
        } else {
            const diff = pickBy(this.value, (value, key) => !isEqual(value, this.initialValue[key]));
            console.log(diff);
            return Object.keys(diff).length ? diff : undefined;
        }
    }


    constructor(
        private usersService: UsersService,
        private transformer: AppClassTransformerService,
    ) { }

    setInitial(value: User | null): void {
        if (value?.username) {
            this.initialValue = value;
            this.form.reset(this.initialValue);
            this.form.controls.password.disable();
        } else {
            this.initialValue = new User();
            this.form.reset(this.initialValue);
            this.form.controls.password.enable();
        }

    }

    save(): Observable<User> {
        if (this.isNew) {
            return this.usersService.addUser(this.value).pipe(
                tap(() => this.form.markAsPristine()),
            );
        } else {
            const update = { username: this.initialValue.username, ...this.changes };
            return this.usersService.updateUser(update).pipe(
                tap(value => this.setInitial(value)),
            );
        }
    }

    reset() {
        this.form.reset(this.initialValue);
    }

    private createForm() {
        return new FormGroup<UserFormGroup>({
            username: new FormControl(
                '',
                [Validators.required, this.usernamePatternValidator],
                [this.existingUsernameValidator()]
            ),
            name: new FormControl(
                '',
                [Validators.required],
            ),
            // admin: new FormControl({ value: false, disabled: true }),
            password: new FormControl(
                '',
                [Validators.required],
            ),
            last_login: new FormControl<Date>({ value: new Date(), disabled: true }),
            userDisabled: new FormControl(false),
            eMail: new FormControl(''),
            preferences: new FormGroup({
                customers: new FormControl([]),
                modules: new FormControl([]),
            }),
            // sessions: new FormControl({ value: undefined, disabled: true }),
        });
    }

    private usernamePatternValidator(control: AbstractControl): ValidationErrors {
        const val: string = control.value || '';
        if (val.match(/ /)) {
            return { symbol: 'Atstarpi nedrīkst izmantot' };
        }
        return null;
    }

    private existingUsernameValidator(): AsyncValidatorFn {
        return (control: AbstractControl<string>): Observable<ValidationErrors> => {
            if (control.value === this.initialValue?.username) {
                return of(null);
            } else {
                return this.usersService.validateUsername(control.value).pipe(
                    map(valid => valid ? null : { existing: 'Esošs lietotājvārds' })
                );
            }
        };
    }


}
