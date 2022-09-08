import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from 'prd-cdk';
import { Observable, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { KastesPasutijumiService } from '../services/kastes-pasutijumi.service';
import { getKastesPreferences } from '../services/kastes-preferences.service';
import { Status as LabelStatuss } from './labels/labels.component';
import { KastesTabulaService } from './services/kastes-tabula.service';
import { TabulaComponent } from './tabula/tabula.component';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  providers: [DestroyService, KastesTabulaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorComponent implements OnInit {

  pasutijumsId$ = getKastesPreferences('pasutijums');
  colors$ = getKastesPreferences('colors');

  apjomi$: Observable<number[]> = this.tabulaService.apjomi$.pipe(
    map(apj => [0, ...apj]),
  );
  // aktīvais apjoms
  apjoms$ = this.tabulaService.apjoms$;

  labelStatuss$ = new Subject<LabelStatuss>();

  kastesAll$ = this.tabulaService.kastesAll$;

  kastesJob$ = this.pasutijumsId$.pipe(
    filter(id => !isNaN(+id)),
    switchMap(id => this.pasutijumiService.getKastesJob(+id)),
  );


  @ViewChild(TabulaComponent) private _tabula: TabulaComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tabulaService: KastesTabulaService,
    private destroy$: DestroyService,
    private pasutijumiService: KastesPasutijumiService,
  ) { }


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

  onSetLabel(kods: number) {
    this.tabulaService.setLabel(kods)
      .subscribe({
        next: kaste => {
          this.labelStatuss$.next({ type: 'kaste', kaste });
          this.tabulaService.setPartialState(kaste);
          this._tabula.scrollToId(kaste);
        },
        error: () => this.labelStatuss$.next({ type: 'empty' }),
      });
  }


}
