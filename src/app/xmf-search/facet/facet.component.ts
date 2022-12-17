import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren, ChangeDetectionStrategy } from '@angular/core';
import { ArchiveFacet, FacetFilter } from '../interfaces';
import { FacetCheckerComponent } from './facet-checker/facet-checker.component';


@Component({
  selector: 'app-facet',
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacetComponent {

  @Input() facet: ArchiveFacet;
  @Output() filter = new EventEmitter<FacetFilter>();

  @ViewChildren(FacetCheckerComponent) private blocks: QueryList<FacetCheckerComponent>;

  facetFilter = new FacetFilter();

  constructor() { }

  onDeselectAll() {
    this.facetFilter = new FacetFilter();
    this.blocks.forEach(bl => bl.deselect());
  }

  onSelect(selected: (string | number)[], key: keyof FacetFilter) {
    this.facetFilter[key] = selected;
    this.filter.next(this.facetFilter);
  }

}
