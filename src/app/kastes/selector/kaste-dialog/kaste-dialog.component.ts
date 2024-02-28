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
import { COLORS } from '../../interfaces';
import { AddressPackage } from '../../interfaces/address-package';
import { kastesPreferences } from '../../services/kastes-preferences.service';


export interface KasteDialogData {
  addressPackage: AddressPackage;
  allAddressPackages: AddressPackage[];
}

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

  addressPackage = inject<KasteDialogData>(MAT_DIALOG_DATA).addressPackage;
  allAddressPackages = inject<KasteDialogData>(MAT_DIALOG_DATA).allAddressPackages;

  colors = COLORS;

  colorCodes = kastesPreferences('colors');

}
