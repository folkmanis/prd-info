import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatLegacySelectionList as MatSelectionList, MatLegacySelectionListChange as MatSelectionListChange } from '@angular/material/legacy-list';
import { FacetCount } from '../../interfaces';

@Component({
  selector: 'app-facet-checker',
  templateUrl: './facet-checker.component.html',
  styleUrls: ['./facet-checker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacetCheckerComponent implements OnInit {

  @ViewChild(MatSelectionList) selection: MatSelectionList;

  @Input() title = '';
  @Input() data: FacetCount[] = [];

  @Output() filterValue: EventEmitter<Array<number | string>> = new EventEmitter();


  constructor() { }

  ngOnInit(): void {
  }

  deselect() {
    this.selection.deselectAll();
  }

  onDeselectAll() {
    this.deselect();
    this.onSelectionChange();
  }

  onSelectionChange(): void {
    const { selected } = this.selection.selectedOptions; // event.source.selectedOptions.selected;
    const filter = selected.length ? selected.map((e) => e.value as number | string) : undefined; // Ja nekas nav atzīmēts, tad vispār nav
    this.filterValue.emit(filter);
  }

}
