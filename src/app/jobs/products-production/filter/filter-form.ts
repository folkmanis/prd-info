import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClassTransformer } from 'class-transformer';
import { parseISO } from 'date-fns';
import { log } from 'prd-cdk';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, share } from 'rxjs/operators';
import { DateUtilsService } from 'src/app/library/date-services/date-utils.service';
import { JobsProductionFilter } from '../../interfaces';
import { isEqual } from 'lodash';

interface NullableInterval {
    start: Date | null;
    end: Date | null;
}

export interface FormData {
    jobStatus: number[] | null,
    category: string[] | null,
    timeInterval: NullableInterval;
}

const DEFAULT_FORM: FormData = {
    jobStatus: [],
    category: [],
    timeInterval: {
        start: null,
        end: null,
    }
};

@Injectable()
export class FilterForm extends FormGroup {

    filterChanges: Observable<JobsProductionFilter>;

    thisWeek = () => this.setInterval(this.dateUtils.thisWeek());
    thisYear = () => this.setInterval(this.dateUtils.thisYear());
    thisMonth = () => this.setInterval(this.dateUtils.thisMonth());
    pastYear = () => this.setInterval(this.dateUtils.pastYear());

    constructor(
        private transformer: ClassTransformer,
        private dateUtils: DateUtilsService,
    ) {
        super({
            jobStatus: new FormControl(),
            category: new FormControl(),
            timeInterval: new FormGroup({
                start: new FormControl(),
                end: new FormControl(),
            })
        });
        this.filterChanges = this.valueChanges.pipe(
            distinctUntilChanged(isEqual),
            map(value => this.flattenForm(value)),
            map(value => this.transformer.plainToInstance(JobsProductionFilter, value)),
        );
    }

    get filterValue(): JobsProductionFilter {
        return this.transformer.plainToInstance(JobsProductionFilter, this.flattenForm(this.value));
    }

    setInterval(interval: NullableInterval = { start: null, end: null, }) {
        this.get('timeInterval').setValue(interval);
    }

    setFormFromRouteParams(params: Record<string, string>, options?: { emitEvent: boolean; }) {
        const data: FormData = { ...DEFAULT_FORM };
        const { jobStatus, category, fromDate, toDate } = params;
        if (jobStatus) {
            data.jobStatus = jobStatus.split(',').map(s => +s);
        }
        if (category) {
            data.category = category.split(',');
        }
        if (fromDate || toDate) {
            data.timeInterval = {
                start: fromDate ? parseISO(fromDate) : null,
                end: toDate ? parseISO(toDate) : null
            };
        }
        if (!isEqual(data, this.value)) {
            this.patchValue(data, options);
        }

    }

    private flattenForm(value: FormData): Record<string, any> {
        const { timeInterval, ...filter } = value;
        return {
            ...filter,
            fromDate: timeInterval.start,
            toDate: timeInterval.end,
        };
    }

}
