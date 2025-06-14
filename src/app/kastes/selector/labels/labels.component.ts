import { ChangeDetectionStrategy, Component, effect, ElementRef, EventEmitter, input, model, Output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HideZeroPipe } from 'prd-cdk';
import { COLORS } from 'src/app/interfaces';
import { AddressPackage } from '../../interfaces/address-package';
import { kastesPreferences } from '../../services/kastes-preferences.service';

export interface LabelStatus {
  type: 'empty' | 'kaste' | 'none';
  addressPackage?: AddressPackage;
}

export class NoopErrorStateMatcher implements ErrorStateMatcher {
  isErrorState = () => false;
}

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ErrorStateMatcher, useClass: NoopErrorStateMatcher }],
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, HideZeroPipe],
})
export class LabelsComponent {
  private kodsInput = viewChild.required<ElementRef<HTMLInputElement>>('kodsInputElement');

  status = input.required<LabelStatus>();

  colors = COLORS;

  colorCodes = kastesPreferences('colors');

  @Output() code = new EventEmitter<number>();

  kods = model('');

  constructor() {
    effect(() => {
      this.status();
      this.kodsInput().nativeElement.disabled = false;
      this.kodsInput().nativeElement.focus();
      this.kodsInput().nativeElement.select();
      if (this.status().type === 'none') {
        this.kods.set('');
      }
    });
  }

  onLabelSubmit(): void {
    this.kodsInput().nativeElement.disabled = true;
    this.code.next(+this.kods());
  }
}
