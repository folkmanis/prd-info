import { DataSource } from '@angular/cdk/table';
import { KastesJob, Veikals, COLORS, Colors, ColorTotals } from 'src/app/interfaces';
import { PasutijumiService } from '../../services/pasutijumi.service';
import { EMPTY, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { map, mapTo, mergeMap, take, tap } from 'rxjs/operators';
import { cacheWithUpdate } from 'src/app/library/rx/cache-with-update';

export class VeikaliDatasource implements DataSource<Veikals> {

    constructor(
        private pasService: PasutijumiService,
    ) { }

    private _initialJob$ = new ReplaySubject<KastesJob>(1);
    private _veikalsUpdate$ = new Subject<Veikals>();

    private _veikali$: Observable<Veikals[]> = this._initialJob$.pipe(
        map(job => job.veikali),
        cacheWithUpdate(this._veikalsUpdate$, this.compareFn),
    );

    kastesTotals$: Observable<[number, number][]> = this._veikali$.pipe(
        map(veikali => this.kastesTotals(veikali)),
    );


    connect(): Observable<Veikals[]> {
        return this._veikali$;
    }

    disconnect() {
        this._initialJob$.complete();
        this._veikalsUpdate$.complete();
    }

    setJob(job: KastesJob) {
        this._initialJob$.next(job);
    }

    updateVeikals(veikals: Veikals): Observable<true | never> {
        return this._initialJob$.pipe(
            take(1),
            mergeMap(job => this.pasService.updateOrderVeikali([veikals])),
            mergeMap(count => count === 1 ? of(veikals) : EMPTY),
            tap(veik => this._veikalsUpdate$.next(veik)),
            mapTo(true),
        );
    }

    private compareFn(o1: Veikals, o2: Veikals): boolean {
        return o1.kods === o2.kods;
    }

    private kastesTotals(veik: Veikals[]): [number, number][] {
        const totM = new Map<number, number>();
        for (const v of veik) {
            v.kastes.forEach(k => totM.set(k.total, (totM.get(k.total) || 0) + 1));
        }
        return [...totM.entries()];
    }

}
