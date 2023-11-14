import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { COLORS, VeikalsKaste } from '../../interfaces';
import { getKastesPreferences } from '../../services/kastes-preferences.service';
import { RowIdDirective } from './row-id.directive';
import { HideZeroPipe } from '../../../library/common/hide-zero.pipe';
import { MatTableModule } from '@angular/material/table';
import { ScrollTopDirective as ScrollTopDirective_1 } from '../../../library/scroll-to-top/scroll-top.directive';
import {
  NgIf,
  NgFor,
  AsyncPipe,
  UpperCasePipe,
  TitleCasePipe,
} from '@angular/common';

const COLUMNS = ['label', 'kods', 'adrese'];

type VeikalsKasteId = Pick<VeikalsKaste, '_id' | 'kaste'>;

@Component({
  selector: 'app-tabula',
  templateUrl: './tabula.component.html',
  styleUrls: ['./tabula.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ScrollTopDirective_1,
    MatTableModule,
    RowIdDirective,
    AsyncPipe,
    UpperCasePipe,
    TitleCasePipe,
    HideZeroPipe,
  ],
})
export class TabulaComponent {
  @ViewChild('scrollContainer', { read: ScrollTopDirective })
  private _scrollable: ScrollTopDirective;
  @ViewChildren(RowIdDirective) private _tableRows: QueryList<RowIdDirective>;

  @Input() set veikalsKastes(value: VeikalsKaste[]) {
    value = Array.isArray(value) ? value : [];
    this.dataSource$.next(value);
  }

  @Output() gatavs = new Subject<VeikalsKaste>();

  dataSource$ = new ReplaySubject<VeikalsKaste[]>(1);

  @Input() selected: VeikalsKaste | undefined;

  @Output() selectedChange = new Subject<VeikalsKaste>();

  colorCodes$ = getKastesPreferences('colors');
  displayedColumns: string[] = [...COLUMNS, ...COLORS];

  colors = COLORS;

  trackByFn(_: number, item: VeikalsKasteId): string {
    return item._id + item.kaste;
  }

  scrollToTop() {
    this._scrollable?.scrollToTop();
  }

  scrollToId(kaste: VeikalsKasteId) {
    this._tableRows
      .find(
        (el) => el.kaste._id === kaste._id && el.kaste.kaste === kaste.kaste
      )
      ?.scrollIn();
  }

  onGatavs(kaste: VeikalsKaste): void {
    this.gatavs.next(kaste);
  }

  onSelected(kaste: VeikalsKaste) {
    this.selectedChange.next(kaste);
    this.selected = kaste;
  }
}
