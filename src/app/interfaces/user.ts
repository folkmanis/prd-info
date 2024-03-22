import { Expose, Type } from 'class-transformer';

export class UserPreferences {

    customers: string[] = [];

    modules: string[] = [];
}

export class LastSeen {

    @Type(() => Date)
    date: Date = new Date();

    ip: string = '';
};


export class UserSession {

    _id: string;

    @Type(() => LastSeen)
    lastSeen: LastSeen;
}


export class GoogleUser {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    link: string;
    picture: string;
    gender: string;
    locale: string;
    hd: string;
}

export class User {

    username: string = '';

    name: string = '';

    password: string = '';

    admin: boolean = false;

    userDisabled: boolean = false;

    eMail: string = '';

    @Type(() => Date)
    last_login?: Date;

    @Type(() => UserPreferences)
    preferences: UserPreferences = new UserPreferences();

    @Type(() => UserSession)
    sessions: UserSession[];

    @Type(() => GoogleUser)
    google?: GoogleUser;

}

