import { Component, input, output, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { FacetCount, FacetFilter } from '../../interfaces';
import { FacetPipe } from './facet.pipe';

@Component({
  selector: 'app-facet-checker',
  templateUrl: './facet-checker.component.html',
  styleUrls: ['./facet-checker.component.scss'],
  imports: [MatButtonModule, MatIconModule, MatListModule, FacetPipe],
})
export class FacetCheckerComponent<
  K extends keyof FacetFilter,
  T extends FacetFilter[K] extends Array<any> ? FacetFilter[K][number] : never,
> {
  selection = viewChild.required(MatSelectionList);

  title = input('');
  data = input.required<FacetCount[]>();

  filterValue = output<FacetFilter[K]>();

  deselect() {
    this.selection().deselectAll();
  }

  onDeselectAll() {
    this.deselect();
    this.onSelectionChange();
  }

  onSelectionChange(): void {
    const { selected } = this.selection().selectedOptions; // event.source.selectedOptions.selected;
    const filter = selected.length ? selected.map((element) => element.value as T) : undefined; // Ja nekas nav atzīmēts, tad vispār nav
    this.filterValue.emit(filter);
  }
}
