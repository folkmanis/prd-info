import { ColorTotals, KastesJob } from 'src/app/interfaces';
import { IFormArray, IFormBuilder, IFormGroup } from '@rxweb/types';
import { FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, EMPTY, ReplaySubject } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { JobService } from 'src/app/services/job.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { PasutijumiResolverService } from './pasutijumi-resolver.service';

export class JobFormSource extends SimpleFormSource<Omit<KastesJob, 'veikali'>> {

    constructor(
        fb: FormBuilder,
        private jobService: JobService,
        private resolver: PasutijumiResolverService,
    ) {
        super(fb);
    }

    private _job$ = new ReplaySubject<KastesJob>(1);
    job$ = this._job$.asObservable();

    createForm(): IFormGroup<Omit<KastesJob, 'veikali'>> {
        return this.fb.group<Omit<KastesJob, 'veikali'>>({
            category: ['perforated paper'],
            jobId: [undefined],
            customer: [''],
            apjomsPlanned: this.fb.array([]),
            name: [''],
            receivedDate: [{ value: undefined, disabled: true }],
            dueDate: [undefined],
            comment: [''],
            invoiceId: [{ value: undefined, disabled: true }],
            // products?: JobProduct[] | JobProduct;
            jobStatus: this.fb.group({
                generalStatus: [undefined]
            }),
            custCode: [undefined],
        });
    }

    initValue(job: KastesJob, params = { emitEvent: true }) {
        this.setApjomsPlannedArray(job.apjomsPlanned);
        super.initValue(job, params);
        this._job$.next(job);
    }

    get isNew(): boolean {
        return false;
    }

    insertFn(): Observable<number> {
        return of(this.value.jobId);
    }

    updateFn(job: KastesJob): Observable<KastesJob> {
        return this.jobService.updateJob(job).pipe(
            mergeMap(_ => this.resolver.retrieveFnFactory(job.jobId)()),
        );
    }

    private setApjomsPlannedArray(apjoms: ColorTotals[] | undefined) {
        const apjControl = this.form.controls.apjomsPlanned as IFormArray<ColorTotals>;
        apjControl.clear();
        (apjoms || []).forEach(apj => apjControl.push(
            this.fb.group<ColorTotals>({
                color: [apj.color],
                total: [apj.total],
            })
        ));
    }
}
