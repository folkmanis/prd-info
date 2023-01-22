import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/library/guards/can-deactivate.guard';
import { UserSettingsComponent } from './user-settings.component';

const routes: Routes = [
    {
        path: '',
        component: UserSettingsComponent,
        canDeactivate: [CanDeactivateGuard],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserSettingsRoutingModule { }