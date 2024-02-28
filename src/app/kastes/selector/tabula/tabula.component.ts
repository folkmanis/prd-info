import {
  AsyncPipe,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
  model,
  viewChild,
  viewChildren
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { HideZeroPipe } from '../../../library/common/hide-zero.pipe';
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
  standalone: true,
  imports: [
    ScrollTopDirective,
    MatTableModule,
    RowIdDirective,
    AsyncPipe,
    UpperCasePipe,
    TitleCasePipe,
    HideZeroPipe,
  ],
})
export class TabulaComponent {

  private scrollable = viewChild.required('scrollContainer', { read: ScrollTopDirective });

  private tableRows = viewChildren(RowIdDirective);

  addressPackages = input.required<AddressPackage[]>();

  completed = model<AddressPackage>();

  @Output()
  selectedChange = new EventEmitter<AddressPackage | undefined>();

  colorCodes = kastesPreferences('colors');

  displayedColumns: string[] = [...COLUMNS, ...COLORS.map(color => 'item-' + color)];

  colors = COLORS;

  trackByFn = (_: number, item: AddressPackage) => item.addressId + item.boxSequence;

  scrollToTop() {
    this.scrollable().scrollToTop();
  }

  scrollToId(documentId: string, boxSequence: number) {
    const row = this.tableRows()
      .find((element) =>
        element.addressPackage.documentId === documentId
        && element.addressPackage.boxSequence === boxSequence
      );
    if (row) {
      row.scrollIn();
    }
  }

  onGatavs(addressPackage: AddressPackage): void {
    this.completed.set(addressPackage);
  }

  onSelected(addressPackage: AddressPackage) {
    this.selectedChange.next(addressPackage);
  }
}
