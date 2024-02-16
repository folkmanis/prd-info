import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  input,
  viewChildren
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ArchiveFacet, FacetFilter } from '../interfaces';
import { FacetCheckerComponent } from './facet-checker/facet-checker.component';

@Component({
  selector: 'app-facet',
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FacetCheckerComponent, MatDividerModule],
})
export class FacetComponent {
  facet = input.required<ArchiveFacet>();
  @Output() filter = new EventEmitter<FacetFilter>();

  private blocks = viewChildren(FacetCheckerComponent);

  facetFilter = new FacetFilter();

  deselectAll() {
    this.facetFilter = new FacetFilter();
    this.blocks().forEach((block) => block.deselect());
  }

  onSelect(selected: (string | number)[], key: keyof FacetFilter) {
    this.facetFilter[key] = selected;
    this.filter.next(this.facetFilter);
  }
}
