import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { KastesPreferencesService } from '../services/kastes-preferences.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, pipe, Subscription, Subject } from 'rxjs';
import { map, tap, filter, switchMap, distinctUntilChanged, takeUntil, pluck } from 'rxjs/operators';
import { KastesTabulaService } from './services/kastes-tabula.service';
import { DestroyService } from 'src/app/library/rx/destroy.service';
import { PasutijumiService } from '../services/pasutijumi.service';
import { KastesJobPartial, Totals } from 'src/app/interfaces';
import { LayoutService } from 'src/app/layout/layout.service';
import { Status as LabelStatuss } from './labels/labels.component';
import { TabulaComponent } from './tabula/tabula.component';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  providers: [DestroyService, KastesTabulaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorComponent implements OnInit {
  @ViewChild(TabulaComponent) private _tabula: TabulaComponent;

  selected: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private kastesPreferencesService: KastesPreferencesService,
    private tabulaService: KastesTabulaService,
    private destroy$: DestroyService,
    private pasutijumiService: PasutijumiService,
    private layoutService: LayoutService
  ) { }

  isSmall$ = this.layoutService.isSmall$;

  // usrPref$ = this.kastesPreferencesService.kastesUserPreferences$;

  preferences$ = this.kastesPreferencesService.preferences$;
  pasutijumi$: Observable<KastesJobPartial[]>;
  colors$ = this.kastesPreferencesService.preferences$.pipe(
    pluck('colors'),
  );
  totals$: Observable<Totals> = this.tabulaService.totals$;


  apjomi$: Observable<number[]> = this.tabulaService.apjomi$.pipe(
    map(apj => [0, ...apj]),
  );

  labelStatuss$ = new Subject<LabelStatuss>();

  ngOnInit() {
    this.pasutijumi$ = this.pasutijumiService.getKastesJobs(true);

    this.route.paramMap.pipe(
      map(params => +params.get('apjoms')),
      tap(apjoms => this.selected = apjoms),
      takeUntil(this.destroy$),
    )
      .subscribe(apjoms => {
        this.tabulaService.setApjoms(apjoms);
        this._tabula?.scrollToTop();
      });

    this.tabulaService.pasutijumsId$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(
      () => {
        this.labelStatuss$.next({ type: 'none' });
        this.router.navigate(['../0'], { relativeTo: this.route });
        this._tabula?.scrollToTop();
      }
    );
  }

  onPasutijumsChanges(pas: number) {
    this.kastesPreferencesService.updateUserPreferences({ pasutijums: pas }).subscribe();
  }

  onReload() {
    this.tabulaService.reload();
  }

  onSetLabel(kods: number | string) {
    this.tabulaService.setLabel(kods)
      .subscribe(kaste => this.labelStatuss$.next({
        type: kaste ? 'kaste' : 'empty',
        kaste
      }));
  }


}
