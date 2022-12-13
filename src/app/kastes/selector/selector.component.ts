import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, merge, mergeMap, Observable, of, share, shareReplay, Subject, switchMap, tap } from 'rxjs';
import { Colors, VeikalsKaste } from '../interfaces';
import { KastesPasutijumiService } from '../services/kastes-pasutijumi.service';
import { getKastesPreferences } from '../services/kastes-preferences.service';
import { Status as LabelStatus } from './labels/labels.component';
import { KasteDialogService } from './services/kaste-dialog.service';
import { KastesLocalStorageService } from './services/kastes-local-storage.service';
import { KastesTabulaService } from './services/kastes-tabula.service';
import { TabulaComponent } from './tabula/tabula.component';


@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorComponent {


  @ViewChild(TabulaComponent) private _tabula: TabulaComponent;


  pasutijumsId$ = getKastesPreferences('pasutijums');
  colorCodes$ = getKastesPreferences('colors');
  showCompleted = new FormControl<boolean>(true);

  private readonly _reload$ = new Subject<void>();
  private readonly _updateKaste$ = new Subject<VeikalsKaste>();

  private allKastes: VeikalsKaste[] = [];


  apjomi$: Observable<number[]> = this.pasutijumsId$.pipe(
    switchMap(pasutijumsId => this.tabulaService.getApjomi(pasutijumsId)),
  );

  kastesJob$ = this.pasutijumsId$.pipe(
    switchMap(id => this.pasutijumiService.getKastesJob(id)),
  );

  pendingCount$ = this.localStorage.pendingCount$;

  apjoms$ = this.route.paramMap.pipe(
    map(params => +params.get('apjoms')),
    tap(() => this._tabula?.scrollToTop()),
  );

  kastesAll$: Observable<VeikalsKaste[]> = this.tabulaService.kastesAll(
    this.pasutijumsId$,
    this._reload$,
    this._updateKaste$
  ).pipe(
    tap(vk => this.allKastes = vk),
    shareReplay(1),
  );

  kastesApjoms$: Observable<VeikalsKaste[]> = combineLatest([
    this.kastesAll$,
    this.apjoms$,
  ]).pipe(
    map(([kastes, apj]) => kastes.filter(k => !apj || k.kastes.total === apj)),
    shareReplay(1),
  );

  totals$ = this.kastesApjoms$.pipe(
    map(kastes => this.tabulaService.calcTotals(kastes)),
  );


  labelStatuss$ = new Subject<LabelStatus>();

  dataSource$: Observable<VeikalsKaste[]> = combineLatest([
    this.kastesApjoms$,
    merge(of(this.showCompleted.value), this.showCompleted.valueChanges),
  ]).pipe(
    map(([data, shCompl]) => data.filter(k => shCompl || !k.kastes.gatavs))
  );


  constructor(
    private route: ActivatedRoute,
    private tabulaService: KastesTabulaService,
    private pasutijumiService: KastesPasutijumiService,
    private localStorage: KastesLocalStorageService,
    private kasteDialog: KasteDialogService,
  ) { }


  onSetLabel(kods: number, pasutijumsId: number) {
    this.tabulaService.setLabel(kods, pasutijumsId)
      .subscribe({
        next: kaste => {
          this.labelStatuss$.next({ type: 'kaste', kaste });
          this._updateKaste$.next(kaste);
          this._tabula.scrollToId(kaste);
        },
        error: () => this.labelStatuss$.next({ type: 'empty' }),
      });
  }

  onSelection(kaste: VeikalsKaste, colorCodes: Record<Colors, string>) {

    if (kaste.loading) {
      return;
    }

    this._updateKaste$.next({ ...kaste, loading: true, });

    this.kasteDialog.openDialog({ kaste, colorCodes, allKastes: this.allKastes }).pipe(
      mergeMap(resp => resp ? this.tabulaService.setGatavs(kaste, resp.setGatavs) : of({ ...kaste, loading: false })),
      tap(kaste => this._updateKaste$.next(kaste)),
    ).subscribe();
  }

  onReload() {
    this._tabula.selected = undefined;
    this._reload$.next();
  }




}
