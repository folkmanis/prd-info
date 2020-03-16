import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { ArchiveFacet, FacetFilter, Count } from '../../services/archive-search-class';
import { MatSelectionListChange, MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-facet-checker',
  templateUrl: './facet-checker.component.html',
  styleUrls: ['./facet-checker.component.css']
})
export class FacetCheckerComponent implements OnInit {
  @ViewChild(MatSelectionList) selection: MatSelectionList;

  title: string;
  key: keyof ArchiveFacet;
  data: Count[];
  filterValue: EventEmitter<Array<number | string>> = new EventEmitter();
  opened: boolean = true;
  emiterFn: (selected: Array<string | number> | undefined) => void;

  constructor() { }

  ngOnInit(): void {
  }

  deselect() {
    this.selection.deselectAll();
  }

  onSelect(event: MatSelectionListChange): void {
    if (!this.emiterFn) { return; }
    const selected = event.source.selectedOptions.selected;
    const filter = selected.length ? selected.map((e) => <number | string>e.value) : undefined; // Ja nekas nav atzīmēts, tad vispār nav
    this.emiterFn(filter);
  }

}
