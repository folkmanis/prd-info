import { FacetFilter } from './facet-filter';

export interface SearchQuery extends FacetFilter {
    q: string;
}
