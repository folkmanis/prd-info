import { User, UserModule } from './user';
import { CustomerPartial, Customer } from './customer';
import { SystemPreferencesObject } from './system-preferences';

export interface SystemState {
    user: User | undefined;
    systemPreferences: SystemPreferencesObject;
    userMenu: UserModule[];
    activeModule: UserModule | undefined;

    loading: boolean;
    initialised: boolean;
    error: string | null;
}

export interface CustomersState {
    customers: CustomerPartial[] | undefined;
    customerMap: Array<[string, Customer]>;
    lastInsertId: string | undefined;

    loading: boolean;
    error: string | null;
}

export interface StoreState {
    system: SystemState;
    customers: CustomersState;
}
