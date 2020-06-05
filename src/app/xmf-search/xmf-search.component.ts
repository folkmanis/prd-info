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
  ) { }

  isSmall$: Observable<boolean> = this.layoutService.isSmall$;

  count$ = this.service.count$;

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  onSearch(search: string) {
    this.service.setSearch(search);
  }

}
