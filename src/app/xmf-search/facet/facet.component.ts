import { ChangeDetectionStrategy, Component, input, output, viewChildren } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ArchiveFacet, FacetFilter } from '../interfaces';
import { FacetCheckerComponent } from './facet-checker/facet-checker.component';

@Component({
  selector: 'app-facet',
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FacetCheckerComponent, MatDividerModule],
})
export class FacetComponent {
  private blocks = viewChildren(FacetCheckerComponent);

  private facetFilter = new FacetFilter();

  facet = input.required<ArchiveFacet>();

  filter = output<FacetFilter>();

  deselectAll() {
    this.facetFilter = new FacetFilter();
    this.blocks().forEach((block) => block.deselect());
  }

  onSelect(selected: (string | number)[], key: keyof FacetFilter) {
    this.facetFilter[key] = selected;
    this.filter.emit(this.facetFilter);
  }
}
