import { Component, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, tap, switchMap, take } from 'rxjs/operators';
import { PasutijumiService } from '../../services/pasutijumi.service';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-select-pasutijums',
  templateUrl: './select-pasutijums.component.html',
  styleUrls: ['./select-pasutijums.component.css']
})
export class SelectPasutijumsComponent implements OnInit, OnDestroy {

  constructor(
    private pasutijumiService: PasutijumiService,
    private prefService: KastesPreferencesService,
  ) { }

  pasControl = new FormControl();
  private readonly _subs = new Subscription();

  pasutijumi$ = this.pasutijumiService.pasutijumi$;

  ngOnInit(): void {
    this.prefService.preferences$.pipe(
      take(1),
    ).subscribe(pref => this.pasControl.setValue(pref.pasutijums, { emitEvent: false }));

    this._subs.add(
      this.pasControl.valueChanges.pipe(
        switchMap(pas => this.prefService.updateUserPreferences({ pasutijums: pas })),
      ).subscribe()
    );
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

}
