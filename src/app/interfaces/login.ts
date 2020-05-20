import { AppHttpResponseBase } from 'src/app/library/http/app-http-response-base';
import { User } from './user';

export interface Login {
    username: string;
    password: string;
}

export interface LoginResponse extends AppHttpResponseBase<User> {
    data: User | undefined;
}
