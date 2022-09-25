import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import { combineLatest, concatMap, from, map, Observable, of, ReplaySubject, shareReplay, startWith, Subject, Subscription, switchMap, tap, toArray } from 'rxjs';
import { combineReload } from 'src/app/library/rxjs';
import { Thread, Attachment, Threads, ThreadsFilterQuery } from '../interfaces';
import { ThreadsPaginatorDirective } from '../threads-paginator/threads-paginator.directive';

export type ThreadsListItem = Pick<Thread, 'id' | 'historyId' | 'snippet'>;

export class ThreadsDatasource implements DataSource<ThreadsListItem> {

    private filter: ThreadsFilterQuery = {
        maxResults: 20,
        labelIds: ['CATEGORY_PERSONAL'],
    };

    private _threadsPaginator: ThreadsPaginatorDirective | null = null;
    set threadsPaginator(value: ThreadsPaginatorDirective | null) {
        this.paginatorSubs?.unsubscribe();
        this._threadsPaginator = value;
        this.paginatorSubs = this.threadsPaginator?.threadPage
            .subscribe(event => this.setPage(event));

    }
    get threadsPaginator() {
        return this._threadsPaginator;
    }

    private paginatorSubs: Subscription | null = null;
    private countSubs: Subscription | null = null;

    private readonly threadsFilter$ = new ReplaySubject<ThreadsFilterQuery>(1);

    private readonly reload$ = new Subject<void>();

    private readonly page$ = new Subject<number>();




    constructor(
        private threadsRetrieveFn: (filter: ThreadsFilterQuery) => Observable<Threads>,
        private messagesCountFn: (filter: ThreadsFilterQuery) => Observable<number>,
    ) { }

    connect(): Observable<readonly ThreadsListItem[]> {

        this.countSubs = combineReload(
            this.threadsFilter$,
            this.reload$
        ).pipe(
            switchMap(filter => this.messagesCountFn(filter)),
        ).subscribe(count => this.threadsPaginator.length = count);

        return threadCache(
            combineReload(
                this.threadsFilter$,
                this.reload$
            ),
            this.page$,
            filter => this.threadsRetrieveFn(filter),
        ).pipe(
            map(data => data.threads),
        );


    }

    disconnect(): void {
        this.countSubs.unsubscribe();
        this.paginatorSubs?.unsubscribe();
    }

    reload() {
        this.reload$.next();
        if (this.threadsPaginator) {
            this.threadsPaginator.matPaginator.pageIndex = 0;
        }
    }



    setFilter(filter: Partial<ThreadsFilterQuery>) {
        this.filter = {
            ...this.filter,
            ...filter,
        };
        if (this.threadsPaginator) {
            this.threadsPaginator.firstPage();
        } else {
            this.threadsFilter$.next(this.filter);
        }
    }

    setPage(event: PageEvent) {

        if (!this.threadsPaginator) return;

        if (event.pageSize !== this.filter.maxResults) {
            this.filter.maxResults = event.pageSize;
            this.threadsPaginator.firstPage();
            return;
        }

        if (event.pageIndex === 0) {
            this.threadsFilter$.next(this.filter);
            return;
        }

        this.page$.next(event.pageIndex);
    }

}

export function threadCache(
    filter$: Observable<ThreadsFilterQuery>,
    pageIndex$: Observable<number>,
    retrieveFn: (query: ThreadsFilterQuery) => Observable<Threads>,
): Observable<Threads> {

    let nextPageTokens: string[] = [];
    let pageIndex = 0;

    return combineLatest({
        filter: filter$.pipe(
            tap(_ => { nextPageTokens = []; pageIndex = 0; }),
        ),
        idx: pageIndex$.pipe(
            startWith(0),
            tap(idx => pageIndex = idx),
        )
    }).pipe(
        switchMap(({ filter }) => of({ ...filter, pageToken: nextPageTokens[pageIndex - 1] }).pipe(
            switchMap(query => retrieveFn(query)),
            tap(threads => nextPageTokens[pageIndex] = threads.nextPageToken),
        )),

    );
}

