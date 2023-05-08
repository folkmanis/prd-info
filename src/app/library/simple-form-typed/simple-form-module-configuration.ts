import { Type } from '@angular/core';
import { ResolveFn } from '@angular/router';

export interface SimpleFormModuleConfiguration<T> {
    path: string;
    editorComponent: Type<any>;
    listComponent: Type<any>;
    resolver: Type<{
    resolve: ResolveFn<T>;
}>;
}
