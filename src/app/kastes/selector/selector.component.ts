import { ChangeDetectionStrategy, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from 'prd-cdk';
import { combineLatest, merge, Observable, of, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { Colors, VeikalsKaste } from '../interfaces';
import { KastesPasutijumiService } from '../services/kastes-pasutijumi.service';
import { getKastesPreferences } from '../services/kastes-preferences.service';
import { Status as LabelStatuss } from './labels/labels.component';
import { KastesLocalStorageService } from './services/kastes-local-storage.service';
import { KastesTabulaService } from './services/kastes-tabula.service';
import { TabulaComponent } from './tabula/tabula.component';
import { KasteDialogService } from './services/kaste-dialog.service';


@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  providers: [DestroyService, KastesTabulaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorComponent implements OnInit, AfterViewInit {


  @ViewChild(TabulaComponent) private _tabula: TabulaComponent;


  pasutijumsId$ = getKastesPreferences('pasutijums');
  colorCodes$ = getKastesPreferences('colors');
  showCompleted = new FormControl<boolean>(true);
  private showCompleted$ = merge(of(this.showCompleted.value), this.showCompleted.valueChanges);



  apjomi$: Observable<number[]> = this.tabulaService.apjomi$;
  // aktīvais apjoms
  apjoms$ = this.tabulaService.apjoms$;

  labelStatuss$ = new Subject<LabelStatuss>();

  kastesAll$ = this.tabulaService.kastesAll$;

  kastesJob$ = this.pasutijumsId$.pipe(
    filter(id => !isNaN(+id)),
    switchMap(id => this.pasutijumiService.getKastesJob(+id)),
  );

  totals$ = this.tabulaService.totals$;

  pendingCount$ = this.localStorage.pendingCount$;

  dataSource$: Observable<VeikalsKaste[]> = combineLatest([
    this.tabulaService.kastesApjoms$,
    this.showCompleted$,
  ]).pipe(
    map(([data, shCompl]) => data.filter(k => shCompl || !k.kastes.gatavs))
  );


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tabulaService: KastesTabulaService,
    private destroy$: DestroyService,
    private pasutijumiService: KastesPasutijumiService,
    private localStorage: KastesLocalStorageService,
    private dialogService: ConfirmationDialogService,
    private kasteDialog: KasteDialogService,
  ) { }


  ngOnInit() {



  }

  ngAfterViewInit(): void {
    this.route.paramMap.pipe(
      map(params => +params.get('apjoms')),
      takeUntil(this.destroy$),
    )
      .subscribe(apjoms => {
        this.tabulaService.setApjoms(apjoms);
        this._tabula?.scrollToTop();
      });

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

  onGatavs(kaste: VeikalsKaste): void {

    if (kaste.loading) {
      return;
    }

    this.tabulaService.setPartialState({
      ...kaste,
      loading: true,
    });

    if (kaste.kastes.gatavs) {
      this.dialogService.confirm('Tiešām?').pipe(
        switchMap(resp => resp ? this.tabulaService.setGatavs(kaste, false) : of(kaste)),
      ).subscribe();
    } else {
      this.tabulaService.setGatavs(kaste, true)
        .subscribe();
    }
  }

  onSelection(kaste: VeikalsKaste, colorCodes: Record<Colors, string>) {
    this.kasteDialog.openDialog(kaste, colorCodes).subscribe();
  }

  onReload() {
    this.tabulaService.reloadState();
    this._tabula.scrollToTop();
  }




}
