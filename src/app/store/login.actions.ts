import { AppParams, Login, SystemPreferences, User } from 'src/app/interfaces';

export class LogIn {
    static readonly type = '[Auth] User Login';
    constructor(public login: Login) { }
}

export class LogOut {
    static readonly type = '[Auth] User Logout';
}
