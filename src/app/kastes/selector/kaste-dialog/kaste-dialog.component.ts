import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { COLORS, VeikalsKaste } from '../../interfaces';
import { KasteDialogData } from '../services/kaste-dialog-data';

@Component({
  selector: 'app-kaste-dialog',
  templateUrl: './kaste-dialog.component.html',
  styleUrls: ['./kaste-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatIconModule,
    MatDialogClose,
    TitleCasePipe,
  ],
})
export class KasteDialogComponent {
  private data: KasteDialogData = inject(MAT_DIALOG_DATA);

  veikalsKaste: VeikalsKaste = this.data.kaste;

  colorCodes = this.data.colorCodes;

  readonly allColors = COLORS;

  colors = COLORS.filter((c) => this.veikalsKaste.kastes[c] > 0);

  kastes = this.data.allKastes.filter((k) => k.kods === this.data.kaste.kods);
}
