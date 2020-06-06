import {
  Component, ComponentFactory, ComponentFactoryResolver, ComponentRef,
  EventEmitter, OnDestroy, OnInit, ViewChild, ViewContainerRef,
  Input, Output
} from '@angular/core';
import { FacetFilter, ArchiveFacet } from '../services/archive-search-class';
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
  @Input() set facet(_f: ArchiveFacet) {
    this._facet = _f;
    this.updateFacet();
  }
  get facet(): ArchiveFacet { return this._facet; }
  @Output() filter = new EventEmitter<Partial<FacetFilter>>();

  private _facet: ArchiveFacet;

  facetFactory: ComponentFactory<FacetCheckerComponent>;
  facetComponents: Map<string, ComponentRef<FacetCheckerComponent>> = new Map();

  constructor(
    private resolver: ComponentFactoryResolver,
  ) { }

  deselect() {
    if (this.facetComponents) {
      this.facetComponents.forEach(comp => comp.instance.deselect());
    }
  }

  ngOnInit() {
    this.facetFactory = this.resolver.resolveComponentFactory(FacetCheckerComponent);
  }

  ngOnDestroy() {
    this.container.clear();
  }

  private onFacet(key: keyof FacetFilter): (selected: Array<string | number> | undefined) => void {
    return (selected) => {
      const f: Partial<FacetFilter> = { [key]: selected };
      this.filter.next(f);
    };
  }

  private updateFacet() {
    if (!this.facet) { return; }
    const keys = Object.keys(this.facet)
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
      comp.instance.data = this.facet[key];
    }
  }
}
