import { Component, ComponentFactoryResolver, OnInit, ChangeDetectionStrategy, ComponentRef, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, startWith, tap, skip } from 'rxjs/operators';
import { LayoutService } from 'src/app/layout/layout.service';
import { ArchiveSearchService } from './services/archive-search.service';
import { SearchInputComponent } from './search-input/search-input.component';
import { FacetComponent } from './facet/facet.component';

@Component({
  selector: 'app-xmf-search',
  templateUrl: './xmf-search.component.html',
  styleUrls: ['./xmf-search.component.css'],
})
export class XmfSearchComponent implements OnInit, OnDestroy {

  constructor(
    private service: ArchiveSearchService,
    private layoutService: LayoutService,
    private resolver: ComponentFactoryResolver,
  ) { }

  searchInput: ComponentRef<SearchInputComponent>;
  facetInput: ComponentRef<FacetComponent>;

  ngOnInit() {
    this.searchInput = this.setSearchInput();
    this.facetInput = this.setFacetInput();
  }

  ngOnDestroy(): void {
    this.service.unsetSearch();
    this.layoutService.clearAllPanels();
  }

  private setSearchInput(): ComponentRef<SearchInputComponent> {
    const factory = this.resolver.resolveComponentFactory(SearchInputComponent);
    const input = this.layoutService.getPanel('top').addComponent(factory) as ComponentRef<SearchInputComponent>;

    input.instance.count$ = this.service.count$;

    this.service.setSearch(input.instance.value$);

    return input;
  }

  private setFacetInput(): ComponentRef<FacetComponent> {
    const factory = this.resolver.resolveComponentFactory(FacetComponent);
    const facet = this.layoutService.getPanel('side').addComponent(factory) as ComponentRef<FacetComponent>;

    return facet;
  }

}
