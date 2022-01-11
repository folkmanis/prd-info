import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { formatISO, parseISO } from 'date-fns';
import { Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { DateUtilsService } from 'src/app/library/date-services/date-utils.service';
import { JobsProductionFilterQuery } from '../../interfaces';
import { SavedJobsProductionQuery } from '../../interfaces/jobs-user-preferences';

interface NullableInterval {
    start: Date | null;
    end: Date | null;
}

export interface ProductsFormData {
    jobStatus: number[],
    category: string[],
    fromDate: Date | null,
    toDate: Date | null,
}

@Injectable()
export class FilterForm extends FormGroup {

    filterChanges: Observable<JobsProductionFilterQuery>;

    valueChanges: Observable<ProductsFormData>;

    thisWeek = () => this.setInterval(this.dateUtils.thisWeek());
    thisYear = () => this.setInterval(this.dateUtils.thisYear());
    thisMonth = () => this.setInterval(this.dateUtils.thisMonth());
    pastYear = () => this.setInterval(this.dateUtils.pastYear());

    constructor(
        private dateUtils: DateUtilsService,
    ) {
        super({
            jobStatus: new FormControl(),
            category: new FormControl(),
            fromDate: new FormControl(),
            toDate: new FormControl(),
        });
        this.filterChanges = this.valueChanges.pipe(
            skip(2), // 2 false events from date inputs
            map(value => this.formToFilterQuery(value)),
        );
    }

    get filterValue(): JobsProductionFilterQuery {
        return this.value;
    }

    setFilterValue(value: ProductsFormData, options?: { emitEvent: boolean; }) {
        super.setValue(value, options);
    }

    setInterval({ start, end }: NullableInterval = { start: null, end: null, }) {
        super.patchValue({
            fromDate: start,
            toDate: end,
        });
    }

    setValueFromQuery(query: SavedJobsProductionQuery, options?: { emitEvent: boolean; }) {
        this.setValue(this.filterQueryToForm(query), options);
    }


    private formToFilterQuery({ jobStatus, category, fromDate, toDate }: Partial<ProductsFormData>): JobsProductionFilterQuery {

        return {
            fromDate: fromDate && formatISO(fromDate, { representation: 'date' }),
            toDate: toDate && formatISO(toDate, { representation: 'date' }),
            jobStatus: jobStatus?.length ? jobStatus : undefined,
            category: category?.length ? category : undefined,
        };
    }

    private filterQueryToForm(query: JobsProductionFilterQuery) {
        const { fromDate, toDate, jobStatus, category } = query;
        return {
            fromDate: fromDate ? parseISO(fromDate) : null,
            toDate: toDate ? parseISO(toDate) : null,
            jobStatus: jobStatus || [],
            category: category || [],
        };
    }


}
