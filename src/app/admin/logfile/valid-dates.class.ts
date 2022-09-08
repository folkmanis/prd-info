import { isSameDay, min, max, format, addDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

interface Interval {
    start: Date,
    end: Date,
}

export class ValidDates {

    public interval: Interval;

    constructor(
        public dates: Date[]
    ) {
        this.interval = {
            start: startOfDay(min(dates)),
            end: endOfDay(max(dates)),
        };
    }

    private dateFormat = (date: Date) => format(date, 'y-MM-dd');

    isValid(date: Date): boolean {
        return date && this.dates.some(d => isSameDay(date, d));
    }

    isMin(value: Date): boolean {
        return isSameDay(value, this.interval.start);
    }

    isMax(value: Date): boolean {
        return isSameDay(value, this.interval.end);
    }

    shift(date: Date, days: 1 | -1): Date {
        let newDate = addDays(date, days);
        while (isWithinInterval(date, this.interval) && !this.isValid(newDate)) {
            newDate = addDays(newDate, days);
        }
        if (!this.isValid(newDate)) {
            return date;
        }
        return newDate;
    }

}
