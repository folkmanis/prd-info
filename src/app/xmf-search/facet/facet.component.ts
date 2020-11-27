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
  styleUrls: ['./facet.component.scss']
})
export class FacetComponent implements OnInit, OnDestroy {
  @ViewChildren(FacetCheckerComponent) blocks: QueryList<FacetCheckerComponent>;
  @Input() facet: ArchiveFacet;
  @Output() filter = new EventEmitter<Partial<FacetFilter>>();

  readonly facetNames: FacetBlock[] = [
    { key: 'year', displayName: 'Gads' },
    { key: 'month', displayName: 'Mēnesis' },
    { key: 'customerName', displayName: 'Klients' }
  ];

  constructor() { }

  deselect() {
    this.blocks.forEach(bl => bl.deselect());
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onSelect(selected: Array<number | string>, key: keyof ArchiveFacet) {
    this.filter.next({ [key]: selected });
  }

}
