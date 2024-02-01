import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { FacetCount } from '../../interfaces';
import { FacetPipe } from './facet.pipe';

@Component({
  selector: 'app-facet-checker',
  templateUrl: './facet-checker.component.html',
  styleUrls: ['./facet-checker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatListModule, FacetPipe],
})
export class FacetCheckerComponent implements OnInit {
  @ViewChild(MatSelectionList) selection: MatSelectionList;

  @Input() title = '';
  @Input() data: FacetCount[] = [];

  @Output() filterValue: EventEmitter<Array<number | string>> =
    new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  deselect() {
    this.selection.deselectAll();
  }

  onDeselectAll() {
    this.deselect();
    this.onSelectionChange();
  }

  onSelectionChange(): void {
    const { selected } = this.selection.selectedOptions; // event.source.selectedOptions.selected;
    const filter = selected.length
      ? selected.map((e) => e.value as number | string)
      : undefined; // Ja nekas nav atzīmēts, tad vispār nav
    this.filterValue.emit(filter);
  }
}
