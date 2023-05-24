import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MaterialPrice } from 'src/app/interfaces';



export class MaterialsPricesDataSource implements DataSource<MaterialPrice> {

    private readonly data = new BehaviorSubject<MaterialPrice[]>([]);

    readonly valueChanges = new Subject<MaterialPrice[]>();

    connect(): Observable<readonly MaterialPrice[]> {
        return this.data.asObservable();
    }

    disconnect(): void {
        this.data.complete();
        this.valueChanges.complete();
    }

    setValue(value: MaterialPrice[]) {
        if (Array.isArray(value)) {
            this.data.next(value);
        } else {
            this.data.next([]);
        }
    }

    addPrice(value: MaterialPrice) {
        this.data.next([...this.data.value, value].sort((a, b) => a.min - b.min));
        this.valueChanges.next(this.data.value);
    }

    updatePrice(value: MaterialPrice, idx: number) {
        const d = [...this.data.value];
        d[idx] = value;
        d.sort((a, b) => a.min - b.min);
        this.data.next(d);
        this.valueChanges.next(d);
    }

    deletePrice(idx: number) {
        const d = this.data.value.filter((price, i) => i !== idx);
        this.data.next(d);
        this.valueChanges.next(d);
    }

    get errors() {
        const duplicates = this.data.value
            .filter((el, idx, a) => a.findIndex(m => m.min === el.min) !== idx)
            .map(ctrl => ctrl.min);
        return duplicates.length === 0 ? null : { duplicates };
    }


}
