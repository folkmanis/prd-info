import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClassTransformer } from 'class-transformer';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateUtilsService } from 'src/app/library/date-services/date-utils.service';
import { JobsProductionFilter } from '../../interfaces';

interface NullableInterval {
    start: Date | null;
    end: Date | null;
}

interface FormData {
    jobStatus: number[] | null,
    category: string[] | null,
    timeInterval: NullableInterval;
}

export const REPRO_DEFAULTS: FormData = {
    jobStatus: [10, 20],
    category: ['repro'],
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
            jobStatus: new FormControl([10, 20]),
            category: new FormControl(),
            timeInterval: new FormGroup({
                start: new FormControl(),
                end: new FormControl(),
            })
        });
        this.filterChanges = this.valueChanges.pipe(
            startWith(this.value),
            map(value => this.flattenForm(value)),
            map((value) => this.transformer.plainToInstance(JobsProductionFilter, value)),
        );
    }

    setInterval(interval: NullableInterval = { start: null, end: null, }) {
        this.get('timeInterval').setValue(interval);
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
