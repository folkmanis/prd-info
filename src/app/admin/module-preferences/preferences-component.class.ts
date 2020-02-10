import { Observable } from 'rxjs';

export interface PreferencesComponent {
    canDeactivate: () => Observable<boolean>;
    onSave: () => void;
    onReset: () => void;
}