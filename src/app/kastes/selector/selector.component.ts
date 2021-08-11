import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { KastesPreferencesService } from '../services/kastes-preferences.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, pipe, Subscription, Subject } from 'rxjs';
import { map, tap, filter, switchMap, distinctUntilChanged, takeUntil, pluck } from 'rxjs/operators';
import { KastesTabulaService } from './services/kastes-tabula.service';
import { DestroyService } from 'prd-cdk';
import { PasutijumiService } from '../services/pasutijumi.service';
import { KastesJobPartial, Totals } from 'src/app/interfaces';
import { LayoutService } from 'src/app/services';
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

  pasutijumsId$ = this.kastesPreferencesService.pasutijumsId$;
  colors$ = this.kastesPreferencesService.preferences$.pipe(
    pluck('colors'),
  );

  apjomi$: Observable<number[]> = this.tabulaService.apjomi$.pipe(
    map(apj => [0, ...apj]),
  );
  // aktīvais apjoms
  apjoms$ = this.tabulaService.apjoms$;

  labelStatuss$ = new Subject<LabelStatuss>();

  kastesJob$ = this.pasutijumsId$.pipe(
    filter(id => !isNaN(+id)),
    switchMap(id => this.pasutijumiService.getOrder(+id)),
  );


  ngOnInit() {

    this.route.paramMap.pipe(
      map(params => +params.get('apjoms')),
      takeUntil(this.destroy$),
    )
      .subscribe(apjoms => {
        this.tabulaService.setApjoms(apjoms);
        this._tabula?.scrollToTop();
      });

    this.pasutijumsId$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(
      () => {
        this.labelStatuss$.next({ type: 'none' });
        this.router.navigate(['../0'], { relativeTo: this.route });
        this._tabula?.scrollToTop();
      }
    );
  }

  onSetLabel(kods: number | string) {
    this.tabulaService.setLabel(kods)
      .subscribe(kaste => {
        this.labelStatuss$.next({
          type: kaste ? 'kaste' : 'empty',
          kaste
        });
        if (kaste) {
          this._tabula.scrollToId(kaste);
        }
      });
  }


}
