import { FormBuilder, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { IFormGroup } from '@rxweb/types';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { User, UserPreferences } from 'src/app/interfaces';
import { UsersService } from '../../services/users.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export class UserFormSource extends SimpleFormSource<User> {

    private currentUser: Partial<User>;

    constructor(
        fb: FormBuilder,
        private usersService: UsersService,
    ) {
        super(fb);
    }

    get isNew(): boolean {
        return !this.currentUser?.username;
    }

    createForm(): IFormGroup<User> {
        const form = this.fb.group<User>({
            username: [
                '',
                [Validators.required, this.usernamePatternValidator]
            ],
            name: [
                '',
                [Validators.required]
            ],
            admin: [{ value: false, disabled: true }],
            password: [
                undefined,
                [Validators.required]
            ],
            last_login: [undefined],
            userDisabled: [false],
            preferences: this.fb.group<UserPreferences>({
                customers: [''],
                modules: [''],
            })
        });
        return form;
    }

    initValue(user: Partial<User>, params?: { emitEvent: boolean; }): void {
        this.currentUser = user;
        const unameCtrl = this.form.controls.username;
        if (user.username) {
            unameCtrl.clearValidators();
            unameCtrl.clearAsyncValidators();
            this.form.controls.password.disable(params);
        } else {
            unameCtrl.setAsyncValidators([this.existingUsernameValidator()]);
            this.form.controls.password.enable(params);
        }
        super.initValue(user, params);
    }

    insertFn(user: User): Observable<string> {
        const userName = user.username;
        console.log(user);
        return this.usersService.addUser(user).pipe(
            map(_ => userName)
        );
    }

    updateFn(user: User): Observable<User> {
        const userName = this.value.username;
        return this.usersService.updateUser(user).pipe(
            switchMap(_ => this.usersService.getUser(userName))
        );
    }

    private usernamePatternValidator(control: AbstractControl): ValidationErrors {
        const val: string = control.value || '';
        if (val.match(/ /)) {
            return { symbol: 'Atstarpi nedrīkst izmantot' };
        }
        return null;
    }

    private existingUsernameValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return this.usersService.validateUsername(control.value).pipe(
                map(valid => valid ? null : { existing: 'Esošs lietotājvārds' })
            );
        };
    }


}
