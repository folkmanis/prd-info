import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class MatPaginatorIntlLv extends MatPaginatorIntl {

    itemsPerPageLabel: string = 'Skaits vienā lapā:';

    /** A label for the button that increments the current page. */
    nextPageLabel: string = 'Nākamā lapa';

    /** A label for the button that decrements the current page. */
    previousPageLabel: string = 'Iepriekšējā lapa';

    /** A label for the button that moves to the first page. */
    firstPageLabel: string = 'Uz sākumu';

    /** A label for the button that moves to the last page. */
    lastPageLabel: string = 'Uz beigām';

    /** A label for the range of items within the current page and the length of the whole list. */
    getRangeLabel: (page: number, pageSize: number, length: number) => string = (
        page: number,
        pageSize: number,
        length: number,
    ) => {
        if (length == 0 || pageSize == 0) {
            return `0 no ${length}`;
        }
        length = Math.max(length, 0);

        const startIndex = page * pageSize;

        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex =
            startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

        return `${startIndex + 1} – ${endIndex} no ${length}`;
    };

}
