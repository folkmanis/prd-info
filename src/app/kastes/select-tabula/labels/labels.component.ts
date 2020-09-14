import { Component, OnInit, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Kaste } from 'src/app/interfaces';
import { filter, switchMap, map, tap, switchAll, mergeMap, pluck, share } from 'rxjs/operators';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { KastesTabulaService } from '../services/kastes-tabula.service';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {
  @ViewChild('kodsInput') kodsInput: ElementRef;
  statuss$: BehaviorSubject<Partial<Kaste> | null> = new BehaviorSubject({});
  inputForm = new FormGroup({
    kods: new FormControl(''),
  });

  constructor(
    private kastesPreferencesService: KastesPreferencesService,
    private tabulaService: KastesTabulaService,
  ) {
  }

  colors$ = this.kastesPreferencesService.preferences$.pipe(
    pluck('colors'),
  );

  ngOnInit() {
    this.tabulaService.apjoms$.next(0);
  }

  onLabelSubmit(): void {
    this.inputForm.disable();
    const kods: number | string = this.inputForm.get('kods').value;
    this.tabulaService.setLabel(kods).pipe(
      tap(() => {
        this.inputForm.reset();
        this.inputForm.enable();
        this.kodsInput.nativeElement.focus();
      }),
    ).subscribe(this.statuss$);
  }

}
