import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReproJobsComponent } from './repro-jobs.component';


const routes: Routes = [
    {
        path: 'repro',
        component: ReproJobsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JobsRoutingModule { }
