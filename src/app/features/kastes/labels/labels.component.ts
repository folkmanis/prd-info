import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { FormGroup, FormControl } from '@angular/forms';
import { Kaste } from '../services/kaste.class';
import { TabulaComponent } from '../tabula/tabula.component';
import { filter, switchMap, map, tap, switchAll, mergeMap } from 'rxjs/operators';
import { KastesPreferencesService } from '../services/kastes-preferences.service';
import { KastesPreferences } from '../services/preferences';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {
  @ViewChild(TabulaComponent) tabula: TabulaComponent;
  @ViewChild('submitButton') submitButton: MatButton;
  statuss$: Observable<Kaste | null>;
  preferences$: Observable<KastesPreferences>;
  inputForm = new FormGroup({
    kods: new FormControl(''),
  });
  onSubmit$: EventEmitter<FormGroup> = new EventEmitter();

  constructor(
    private kastesPreferencesService: KastesPreferencesService,
  ) {
    this.preferences$ = this.kastesPreferencesService.preferences;
  }

  ngOnInit() {
    this.inputForm.get('kods').valueChanges
      .subscribe(val => {
        if (val) { this.statuss$ = undefined; }
      });

    this.onSubmit$.pipe(
      map(form => +form.get('kods').value),
      filter(kods => !isNaN(kods)),
      tap(() => this.submitButton.disabled = true),
      mergeMap(kods => this.tabula.setLabel(kods)),
    ).subscribe(kaste => {
      this.statuss$ = of(kaste);
      this.submitButton.disabled = false;
      this.inputForm.reset();
    });
  }

}
