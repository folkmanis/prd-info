import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReproJobComponent } from './repro-job.component';
import { ReproJobListComponent } from './repro-job-list/repro-job-list.component';
import { ReproJobResolverService } from './services/repro-job-resolver.service';
import { ReproJobEditComponent } from './repro-job-edit/repro-job-edit.component';

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
                    job: ReproJobResolverService,
                }
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JobsRoutingModule { }
