import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren, ChangeDetectionStrategy } from '@angular/core';
import { ArchiveFacet, FacetFilter } from 'src/app/interfaces/xmf-search';
import { FacetCheckerComponent } from './facet-checker/facet-checker.component';


@Component({
  selector: 'app-facet',
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacetComponent implements OnInit, OnDestroy {

  @ViewChildren(FacetCheckerComponent) private blocks: QueryList<FacetCheckerComponent>;

  @Input() facet: ArchiveFacet;
  @Output() filter = new EventEmitter<Partial<FacetFilter>>();

  constructor() { }

  onDeselectAll() {
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
