import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, createSelector } from '@ngxs/store';
import { patch, removeItem, insertItem } from '@ngxs/store/operators';
import { Observable, EMPTY } from 'rxjs';
import { omit } from 'lodash';
import { tap, map, switchMap, mergeMap } from 'rxjs/operators';
import { Job, JobPartial, JobOneProduct, JobQueryFilter } from 'src/app/interfaces';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import * as JobActions from './jobs.actions';

const MAX_CACHE_AGE = 30000;

export interface JobCacheEntry {
    job: Job;
    retrieveTime: number;
}

export interface JobsStateModel {
    jobs: JobOneProduct[];
    filter: JobQueryFilter;
    jobCache: JobCacheEntry[];
    lastInsertId: number | undefined;
}

@State<JobsStateModel>({
    name: 'jobs',
    defaults: {
        jobs: [],
        filter: {},
        jobCache: [],
        lastInsertId: undefined,
    }
})
@Injectable()
export class JobsState {

    constructor(
        private prdApi: PrdApiService,
    ) { }

    @Selector()
    static jobs(state: JobsStateModel): JobOneProduct[] {
        return state.jobs;
    }

    @Selector()
    static lastInsertId(state: JobsStateModel): number {
        return state.lastInsertId;
    }

    static job(jobId: number): (state: JobsStateModel) => Job {
        const selector = createSelector(
            [JobsState],
            (state: JobsStateModel) => state.jobCache.find(cached => cached.job.jobId === jobId)?.job
        );
        return selector;
    }

    @Action(JobActions.RetrieveJobs)
    retrieveJobs(ctx: StateContext<JobsStateModel>): Observable<any> {
        const state = ctx.getState();
        return this.prdApi.jobs.get(state.filter).pipe(
            tap(jobs => ctx.patchState({ jobs }))
        );
    }

    @Action(JobActions.SetFilter)
    setFilter(ctx: StateContext<JobsStateModel>, { filter }: JobActions.SetFilter) {
        ctx.patchState({ filter });
        ctx.dispatch(new JobActions.RetrieveJobs());
    }

    @Action(JobActions.GetJob)
    getJob(ctx: StateContext<JobsStateModel>, { jobId }: JobActions.GetJob): Observable<any> | void {
        const state = ctx.getState();
        const timeNow = Date.now();
        const newCache = state.jobCache.filter(job => timeNow - job.retrieveTime < MAX_CACHE_AGE);
        if (newCache.find(job => job.job.jobId === jobId)) {
            ctx.patchState({ jobCache: newCache });
            return;
        }
        return this.prdApi.jobs.get(jobId).pipe(
            tap(job => {
                newCache.push({ job, retrieveTime: Date.now() });
                ctx.patchState({ jobCache: newCache });
            })
        );
    }

    @Action(JobActions.UpdateJob)
    updateJob(ctx: StateContext<JobsStateModel>, { jobId, job }: JobActions.UpdateJob) {
        if (!job.jobId) { return; }
        // uzreiz izņem no cache
        ctx.setState(patch({
            jobCache: removeItem<JobCacheEntry>(cached => cached.job.jobId === jobId),
        }));
        const jobUpdate = omit(job, ['jobId', '_id']);
        return this.prdApi.jobs.updateOne(jobId, jobUpdate).pipe(
            mergeMap(resp => !resp ? EMPTY : ctx.dispatch(new JobActions.GetJob(jobId))),
            switchMap(() => ctx.dispatch(new JobActions.RetrieveJobs())),
        );
    }

    @Action(JobActions.NewJob)
    newJob(ctx: StateContext<JobsStateModel>, { job }: JobActions.NewJob) {
        return this.prdApi.jobs.insertOne(job).pipe(
            tap(newId => ctx.patchState({ lastInsertId: +newId })),
            switchMap(newId => ctx.dispatch(new JobActions.RetrieveJobs()))
        );
    }
}
