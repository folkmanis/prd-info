import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Self } from '@angular/core';
import { FormBuilder, NgControl } from '@angular/forms';
import { Colors, COLORS, KastesSettings } from 'src/app/interfaces';
import { DestroyService } from 'src/app/library/rx';
import { AbstractPreferencesDirective } from '../abstract-preferences.directive';

type KastesSettingsPartial = Partial<KastesSettings>;

@Component({
  selector: 'app-kastes-preferences',
  templateUrl: './kastes-preferences.component.html',
  styleUrls: ['./kastes-preferences.component.scss'],
  providers: [DestroyService],
})
export class KastesPreferencesComponent extends AbstractPreferencesDirective<KastesSettings> implements OnInit, OnDestroy {

  readonly colors = [...COLORS];

  constructor(
    cd: ChangeDetectorRef,
    fb: FormBuilder,
    @Self() ngControl: NgControl,
    fm: FocusMonitor,
    elRef: ElementRef<HTMLElement>,
  ) {
    super(ngControl, fb, cd, fm, elRef);
    this.controls = this.fb.group<KastesSettingsPartial>({
      colors: this.fb.group<{ [key in Colors]: string; }>(
        Object.assign({}, ...COLORS.map(col => ({ [col]: '' })))
      )
    });
  }

  protected writeControl(obj: KastesSettings) {
    this.controls.patchValue(obj);
  }


}
