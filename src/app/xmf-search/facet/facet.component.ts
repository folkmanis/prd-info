import {
  Component, ComponentFactory, ComponentFactoryResolver, ComponentRef,
  EventEmitter, OnDestroy, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { FacetFilter } from '../services/archive-search-class';
import { ArchiveSearchService } from '../services/archive-search.service';
import { FacetCheckerComponent } from './facet-checker/facet-checker.component';
import { PanelComponent } from 'src/app/interfaces';

const FACET_NAMES: Map<string, { displayName: string, index: number, }> = new Map<string, { displayName: string, index: number, }>()
  .set('year', { displayName: 'Gads', index: 0 })
  .set('month', { displayName: 'Mēnesis', index: 1 })
  .set('customerName', { displayName: 'Klients', index: 2 });

@Component({
  selector: 'app-facet',
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.css']
})
export class FacetComponent implements OnInit, OnDestroy, PanelComponent {
  @ViewChild('itemsCaontainer', { static: true, read: ViewContainerRef }) container: ViewContainerRef;
  facetSubs: Subscription;
  resetSubs: Subscription;
  facetChange: EventEmitter<Partial<FacetFilter>> = new EventEmitter();
  facetFactory: ComponentFactory<FacetCheckerComponent>;
  facetComponents: Map<string, ComponentRef<FacetCheckerComponent>> = new Map();

  constructor(
    private archiveSearchService: ArchiveSearchService,
    private resolver: ComponentFactoryResolver,
  ) { }

  ngOnInit() {
    this.facetFactory = this.resolver.resolveComponentFactory(FacetCheckerComponent);
    /** Nodod facet filtru servisam (serviss parakstās uz izmaiņām) */
    this.archiveSearchService.setFacetFilter(this.facetChange);
    /** Parakstās uz facet rezultātiem */
    this.facetSubs = this.archiveSearchService.facetResult$.subscribe(res => {
      const keys = Object.keys(res)
        .sort((a, b) => FACET_NAMES.get(a)?.index - FACET_NAMES.get(b)?.index);
      for (const key of keys) {
        const facetName = FACET_NAMES.get(key) || { displayName: '', index: undefined };
        let comp: ComponentRef<FacetCheckerComponent>;
        if (this.facetComponents.has(key)) {
          comp = this.facetComponents.get(key);
        } else {
          comp = this.container.createComponent(this.facetFactory);
          comp.instance.key = key;
          comp.instance.emiterFn = this.onFacet(key);
          comp.instance.title = facetName.displayName;
          this.facetComponents.set(key, comp);
        }
        comp.instance.data = res[key];
      }
    });
    /** Kad jauns meklējums, tad visi filtri tiek noņemti */
    this.resetSubs = this.archiveSearchService.searchString$
      .subscribe(() => this.facetComponents && this.facetComponents.forEach(comp => comp.instance.deselect()));

  }

  ngOnDestroy() {
    this.facetSubs.unsubscribe();
    this.resetSubs.unsubscribe();
    /** Paziņo servisam, ka var atrakstīties */
    this.archiveSearchService.unsetFacetFilter();
    this.container.clear();
  }

  private onFacet(key: keyof FacetFilter): (selected: Array<string | number> | undefined) => void {
    const emiter = this.facetChange;
    return (selected) => {
      const filter: Partial<FacetFilter> = {};
      filter[key] = selected;
      emiter.next(filter);
    };
  }

}
