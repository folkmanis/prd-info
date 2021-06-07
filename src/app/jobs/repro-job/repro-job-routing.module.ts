import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReproJobComponent } from './repro-job.component';
import { ReproJobListComponent } from './repro-job-list/repro-job-list.component';
import { ReproJobEditComponent } from './repro-job-edit/repro-job-edit.component';
import { ReproJobService } from './services/repro-job.service';
import { CanDeactivateGuard } from 'src/app/library/guards/can-deactivate.guard';

const routes: Routes = [
    {
        path: 'repro',
        component: ReproJobComponent,
        children: [
            {
                path: '',
                component: ReproJobListComponent,
            },
            {
                path: 'new',
                component: ReproJobEditComponent,
                data: {
                    job: {},
                },
            },
            {
                path: ':jobId',
                component: ReproJobEditComponent,
                resolve: {
                    job: ReproJobService,
                },
                canDeactivate: [CanDeactivateGuard]
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JobsRoutingModule { }
