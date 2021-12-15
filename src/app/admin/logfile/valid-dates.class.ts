import moment from 'moment';

export class ValidDates {

    public dates: Set<string>;
    public min: moment.Moment;
    public max: moment.Moment;

    constructor(datesArray: string[]) {
        this.dates = new Set(datesArray);
        this.min = moment(datesArray.slice(0, 1).pop());
        this.max = moment(datesArray.slice(-1).pop());
    }

    isValid(date: moment.Moment): boolean {
        return this.dates.has(date?.format('Y-MM-DD'));
    }

    isMin(value: moment.Moment): boolean {
        return value.isSame(this.min, 'days');
    }

    isMax(value: moment.Moment): boolean {
        return value.isSame(this.max, 'days');
    }

    shift(date: moment.Moment, days: 1 | -1): moment.Moment {
        const newDate = date.clone().add(days, 'days');
        while (newDate.isBetween(this.min, this.max, 'date', '[]') && !this.isValid(newDate)) {
            newDate.add(days, 'days');
        }
        if (!newDate.isBetween(this.min, this.max, 'date', '[]')) {
            return date;
        }
        return newDate;
    }

}
