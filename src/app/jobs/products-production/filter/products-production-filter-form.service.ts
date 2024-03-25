import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { formatISO, parseISO } from 'date-fns';
import { DateUtilsService } from 'src/app/library/date-services/date-utils.service';
import { JobsProductionFilterQuery } from '../../interfaces';
import { pickBy } from 'lodash-es';

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

type ProductFormControl = {
    [key in keyof ProductsFormData]: FormControl<ProductsFormData[key]>
};

@Injectable({
    providedIn: 'root',
})
export class ProductsProductionFilterFormService {


    constructor(
        private dateUtils: DateUtilsService,
    ) { }


    thisWeekFn(form: FormGroup<ProductFormControl>) {
        return () => this.setInterval(form, this.dateUtils.thisWeek());
    }

    thisYearFn(form: FormGroup<ProductFormControl>) {
        return () => this.setInterval(form, this.dateUtils.thisYear());
    }

    thisMonthFn(form: FormGroup<ProductFormControl>) {
        return () => this.setInterval(form, this.dateUtils.thisMonth());
    }

    pastYearFn(form: FormGroup<ProductFormControl>) {
        return () => this.setInterval(form, this.dateUtils.pastYear());
    }

    createForm(): FormGroup<ProductFormControl> {
        return new FormGroup({
            jobStatus: new FormControl(),
            category: new FormControl(),
            fromDate: new FormControl(),
            toDate: new FormControl(),
        });
    }

    setInterval(
        form: FormGroup<ProductFormControl>,
        { start, end }: NullableInterval = { start: null, end: null, }
    ) {
        form.patchValue({
            fromDate: start,
            toDate: end,
        });
    }


    formToFilterQuery({ jobStatus, category, fromDate, toDate }: Partial<ProductsFormData>): JobsProductionFilterQuery {

        const query = {
            fromDate: fromDate && formatISO(fromDate, { representation: 'date' }),
            toDate: toDate && formatISO(toDate, { representation: 'date' }),
            jobStatus: jobStatus?.length ? jobStatus : undefined,
            category: category?.length ? category : undefined,
        };

        return pickBy(query);
    }

    filterQueryToForm(query: JobsProductionFilterQuery) {
        const { fromDate, toDate, jobStatus, category } = query;
        return {
            fromDate: fromDate ? parseISO(fromDate) : null,
            toDate: toDate ? parseISO(toDate) : null,
            jobStatus: jobStatus || [],
            category: category || [],
        };
    }


}
