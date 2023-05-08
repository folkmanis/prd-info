import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { UserSettingsComponent } from './user-settings.component';

const routes: Routes = [
    {
        path: '',
        component: UserSettingsComponent,
        canDeactivate: [canComponentDeactivate],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserSettingsRoutingModule { }