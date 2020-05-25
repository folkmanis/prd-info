import { LoginEffectsService } from './login-effects.service';
import { SystemPreferencesEffectService } from './system-preferences-effect.service';
import { CustomersEffectsService } from './customers-effects.service';

export const effects = [
    LoginEffectsService,
    SystemPreferencesEffectService,
    CustomersEffectsService,
];
