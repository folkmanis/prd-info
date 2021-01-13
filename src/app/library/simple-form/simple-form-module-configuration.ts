import { Type } from '@angular/core';
import { Resolve } from '@angular/router';

export interface SimpleFormModuleConfiguration<T> {
    path: string;
    editorComponent: Type<any>;
    listComponent: Type<any>;
    resolver: Type<Resolve<T>>;
}
