import { FacetFilter } from './facet-filter';

export class SearchQuery {
  constructor(
    public q: string = '',
    private facet = new FacetFilter(),
  ) {}

  setFacet(facet: FacetFilter): SearchQuery {
    return new SearchQuery(this.q, facet);
  }

  searialize(): string {
    return JSON.stringify({
      q: this.q,
      ...this.facet,
    });
  }
}
