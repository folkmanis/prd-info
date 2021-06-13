import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { Count } from 'src/app/interfaces/xmf-search';

@Component({
  selector: 'app-facet-checker',
  templateUrl: './facet-checker.component.html',
  styleUrls: ['./facet-checker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacetCheckerComponent implements OnInit {
  @ViewChild(MatSelectionList) selection: MatSelectionList;

  @Input() title = '';
  @Input() data: Count[] = [];

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
    const selected = this.selection.selectedOptions.selected; // event.source.selectedOptions.selected;
    const filter = selected.length ? selected.map((e) => e.value as number | string) : undefined; // Ja nekas nav atzīmēts, tad vispār nav
    this.filterValue.emit(filter);
  }

}
