import { Component, input, output, viewChildren } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ArchiveFacet, FacetFilter } from '../interfaces';
import { FacetCheckerComponent } from './facet-checker/facet-checker.component';

@Component({
  selector: 'app-facet',
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.scss'],
  imports: [FacetCheckerComponent, MatDividerModule],
})
export class FacetComponent {
  private blocks = viewChildren(FacetCheckerComponent);

  private facetFilter: FacetFilter = {};

  facet = input.required<ArchiveFacet | null>();

  filter = output<FacetFilter>();

  deselectAll() {
    this.facetFilter = {};
    this.blocks().forEach((block) => block.deselect());
  }

  onSelect<K extends keyof FacetFilter>(selected: FacetFilter[K], key: K) {
    this.facetFilter[key] = selected;
    this.filter.emit(this.facetFilter);
  }
}
