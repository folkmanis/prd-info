import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COLORS, VeikalsKaste } from '../../interfaces';
import { KasteDialogData, KasteDialogResponse } from '../services/kaste-dialog-data';

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
    private dialogRef: MatDialogRef<KasteDialogComponent, KasteDialogResponse>,
  ) { }

  ngOnInit(): void {
  }

  onGatavs(setGatavs: boolean) {
    this.dialogRef.close({ setGatavs });
  }



}
