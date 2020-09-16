import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ArchiveFacet, FacetFilter } from 'src/app/interfaces/xmf-search';
import { FacetCheckerComponent } from './facet-checker/facet-checker.component';

interface FacetBlock {
  key: keyof ArchiveFacet;
  displayName: string;
}

@Component({
  selector: 'app-facet',
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.css']
})
export class FacetComponent implements OnInit, OnDestroy {
  @ViewChildren(FacetCheckerComponent) blocks: QueryList<FacetCheckerComponent>;
  @Input() set facet(_f: ArchiveFacet) {
    this._facet = _f;
  }
  get facet(): ArchiveFacet { return this._facet; }
  @Output() filter = new EventEmitter<Partial<FacetFilter>>();

  readonly facetNames: FacetBlock[] = [
    { key: 'year', displayName: 'Gads' },
    { key: 'month', displayName: 'Mēnesis' },
    { key: 'customerName', displayName: 'Klients' }
  ];

  private _facet: ArchiveFacet;

  constructor() { }

  deselect() {
    this.blocks.forEach(bl => bl.deselect());
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onSelect(selected: Array<number | string>, key: string) {
    this.filter.next({ [key]: selected });
  }

}
