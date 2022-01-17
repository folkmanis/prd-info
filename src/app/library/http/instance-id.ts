import { Inject, Injectable, InjectionToken } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

export const INSTANCE_ID = new InjectionToken<string>(
    'Instance-Id',
    {
        providedIn: 'root',
        factory: () => uuidv4(),
    }
);
