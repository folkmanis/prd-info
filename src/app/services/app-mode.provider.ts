import { InjectionToken } from '@angular/core';
import { environment } from 'src/environments/environment';

const DEMO_MODE = new InjectionToken<boolean>('Is demo mode enabled', {
    factory: () => !!environment.demo
});