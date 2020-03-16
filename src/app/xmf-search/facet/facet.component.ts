import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, AfterContentInit, AfterViewInit, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef } from '@angular/core';
import { MatSelectionListChange, MatSelectionList } from '@angular/material/list';
import { ArchiveSearchService } from '../services/archive-search.service';
import { ArchiveFacet, FacetFilter } from '../services/archive-search-class';
import { Subscription } from 'rxjs';
import { FacetCheckerComponent } from './facet-checker/facet-checker.component';
import { tap } from 'rxjs/operators';

const facetNames: Map<string, string> = new Map()
  .set('year', 'Gads')
  .set('month', 'Mēnesis')
  .set('customerName', 'Klients');

@Component({
  selector: 'app-facet',
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.css']
})
export class FacetComponent implements OnInit, OnDestroy, AfterViewInit {
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
    this.facetSubs = this.archiveSearchService.facetResult$.pipe(
    )
      .subscribe(res => {
        for (const key in res) {
          if (!res.hasOwnProperty(key)) { //  && res[key].length > 0
            continue;
          }
          let comp: ComponentRef<FacetCheckerComponent>;
          if (this.facetComponents.has(key)) {
            comp = this.facetComponents.get(key)
          } else {
            comp = this.container.createComponent(this.facetFactory);
            this.facetComponents.set(key, comp);
          }
          comp.instance.key = key;
          comp.instance.title = facetNames.get(key) || '';
          comp.instance.data = res[key];
          comp.instance.emiterFn = this.onFacet(key);
        }
      });
    /** Kad jauns meklējums, tad visi filtri tiek noņemti */
    this.resetSubs = this.archiveSearchService.resetFacet.subscribe(() => {
      if (this.facetComponents) {
        this.facetComponents.forEach(comp => comp.instance.deselect());
      }
    });

  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.facetSubs.unsubscribe();
    this.resetSubs.unsubscribe();
    /** Paziņo servisam, ka var atrakstīties */
    this.archiveSearchService.unsetFacetFilter();
  }

  onFacet(key: keyof FacetFilter): (selected: Array<string | number> | undefined) => void {
    const emiter = this.facetChange;
    return (selected) => {
      const filter: Partial<FacetFilter> = {};
      filter[key] = selected;
      emiter.next(filter);
    };
  }

}
