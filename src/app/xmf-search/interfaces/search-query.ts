import { FacetFilter } from './facet-filter';

export class SearchQuery {

    private facet = new FacetFilter();

    constructor(
        public q: string = '',
    ) { }

    setFacet(facet: FacetFilter) {
        this.facet = facet;
    }

    searialize(): string {
        return JSON.stringify({
            q: this.q,
            ...this.facet,
        });
    }
}
