export interface User {
    username: string;
    name: string;
    password: string;
    admin: boolean;
    last_login: Date;
    userDisabled: boolean;
    preferences: UserPreferences;
    sessions: UserSession[];
    google?: GoogleUser;
    isGmail?: boolean;
}

export interface UserPreferences {
    eMail: string;
    customers: string[];
    modules: string[];
}

export interface UserSession {
    _id: string;
    lastSeen: {
        date: Date;
        ip: string;
    };
}


export interface GoogleUser {
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