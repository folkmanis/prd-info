import { Inject, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { KasteDialogData } from '../services/kaste-dialog-data';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VeikalsKaste } from '../../interfaces';
import { getKastesPreferences } from '../../services/kastes-preferences.service';
import { COLORS, Colors } from '../../interfaces';

@Component({
  selector: 'app-kaste-dialog',
  templateUrl: './kaste-dialog.component.html',
  styleUrls: ['./kaste-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KasteDialogComponent implements OnInit {

  veikalsKaste: VeikalsKaste = this.data.kaste;

  colorCodes = this.data.colorCodes;

  colors = COLORS.filter(c => this.veikalsKaste.kastes[c] > 0);

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: KasteDialogData,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
