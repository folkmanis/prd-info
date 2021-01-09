import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AdreseBox, Box } from '../../../upload/services/adrese-box';
import { TotalValidatorDirective } from './total-validator.directive';
import { KastesPreferencesService } from '../../../services/kastes-preferences.service';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @Input() adrBox: AdreseBox;
  @Output() finish: EventEmitter<boolean> = new EventEmitter(); // false - ja atcēla, true - ja izmainīja
  boxColors = ['yellow', 'rose', 'white'];
  preferences$ = this.kastesPreferencesService.preferences$;
  editorForm: FormGroup;
  rowSums: number[] = [];
  colSums: Box = new Box();

  constructor(
    private kastesPreferencesService: KastesPreferencesService,
  ) { }

  ngOnInit() {
    this.createFormCtr(this.adrBox.box);
    ({ row: this.rowSums, col: this.colSums } = TotalValidatorDirective.calcTotals(this.editorForm.value));
    this.editorForm.valueChanges.subscribe((val) => {
      ({ row: this.rowSums, col: this.colSums } = TotalValidatorDirective.calcTotals(val));
    });
  }

  onAccept() {
    this.adrBox.box = [];
    for (const boxK of Object.keys(this.editorForm.value)) {
      const box = this.editorForm.value[boxK];
      this.adrBox.box[boxK] = new Box({ ...box });
    }
    this.finish.emit(true);
  }
  onCancel() {
    this.finish.emit(false);
  }

  private createFormCtr(adrB: Box[]) {
    const boxGroup: any = {};
    for (const bKey of Object.keys(adrB)) {
      const box = adrB[bKey];
      const gr: { [name: string]: FormControl; } = {};
      for (const cKey of Object.keys(box)) {
        gr[cKey] = new FormControl(box[cKey],
          {
            validators: [this.intValidator(), this.minmaxValidator(0, TotalValidatorDirective.max)],
            updateOn: 'change',
          }
        );
      }
      boxGroup[bKey] = new FormGroup(gr);
    }
    this.editorForm = new FormGroup(boxGroup, { validators: [TotalValidatorDirective.totalValidator(this.adrBox.totals)] });
  }

  private minmaxValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): null => {
      if (control.value > max) {
        control.setValue(max);
      }
      if (control.value < min) {
        control.setValue(min);
      }
      if (control.value === null) {
        control.setValue(min);
      }
      return null;
    };
  }
  /**
   * Atļauj ievadīt tikai veselus skaitļus. Izmaina vērtību, un vienmēr atgriež null
   */
  private intValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value !== Math.floor(control.value)) {
        control.setValue(Math.floor(control.value));
      }
      return null;
    };
  }

}
