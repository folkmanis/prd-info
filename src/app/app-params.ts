import { InjectionToken } from '@angular/core';
import { AppParams } from './interfaces';

export const APP_PARAMS = new InjectionToken<AppParams>('prd.defaults');

export const PRD_DEFAULTS: AppParams = {
    apiPath: '/data/'
};
