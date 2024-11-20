import { CdkScrollable } from '@angular/cdk/scrolling';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model, output, viewChild, viewChildren } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { HideZeroPipe } from 'prd-cdk';
import { COLORS } from '../../interfaces';
import { AddressPackage } from '../../interfaces/address-package';
import { kastesPreferences } from '../../services/kastes-preferences.service';
import { RowIdDirective } from './row-id.directive';

const COLUMNS = ['label', 'kods', 'adrese'];

@Component({
    selector: 'app-tabula',
    templateUrl: './tabula.component.html',
    styleUrls: ['./tabula.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ScrollTopDirective, MatTableModule, RowIdDirective, UpperCasePipe, TitleCasePipe, HideZeroPipe, CdkScrollable]
})
export class TabulaComponent {
  private scrollTopDirective = viewChild.required(ScrollTopDirective);

  private tableRows = viewChildren(RowIdDirective);

  addressPackages = input.required<AddressPackage[]>();

  completed = model<AddressPackage>();

  selectedChange = output<AddressPackage | undefined>();

  colorCodes = kastesPreferences('colors');

  displayedColumns: string[] = [...COLUMNS, ...COLORS.map((color) => 'item-' + color)];

  colors = COLORS;

  trackByFn = (_: number, item: AddressPackage) => item.addressId + item.boxSequence;

  scrollToTop() {
    this.scrollTopDirective().scrollToTop();
  }

  scrollToId(documentId: string, boxSequence: number) {
    this.tableRows()
      .find((row) => row.addressPackage().documentId === documentId && row.addressPackage().boxSequence === boxSequence)
      ?.scrollIn();
  }

  onGatavs(addressPackage: AddressPackage): void {
    this.completed.set(addressPackage);
  }

  onSelected(addressPackage: AddressPackage) {
    this.selectedChange.emit(addressPackage);
  }
}
