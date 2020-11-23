import { AppHttpResponseBase } from 'src/app/library/http/app-http-response-base';

export interface User {
    username: string;
    name: string;
    password: string;
    admin: boolean;
    last_login: Date;
    userDisabled: boolean;
    preferences: UserPreferences;
}

export interface UserPreferences {
    customers: string[];
    modules: string[];
}

export interface UsersResponse extends AppHttpResponseBase<User> { }
