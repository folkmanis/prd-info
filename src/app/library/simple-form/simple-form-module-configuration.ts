import { Type } from '@angular/core';
import { Resolve } from '@angular/router';
import { RetrieveFn } from './simple-form-resolver.service';

export interface SimpleFormModuleConfiguration<T, U> {
    path: string;
    editorComponent: Type<any>;
    listComponent: Type<any>;
    retrieveFnFactory: (serv: U) => RetrieveFn<T>;
    resolverDeps: Type<U>;
}
