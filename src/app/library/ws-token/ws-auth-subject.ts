import { Observable, Observer } from 'rxjs';
import { take } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';

export interface MultiplexConfig<U> {
    subMsg: (token: string) => any;
    unsubMsg: () => any;
    messageFilter: (value: U) => boolean;
    tokenFn: () => Observable<string>;
}

export class WsAuthSubject<T> extends WebSocketSubject<T> {

    multiplexAuth({ subMsg, unsubMsg, messageFilter, tokenFn }: MultiplexConfig<T>): Observable<T> {
        return new Observable((observer: Observer<T>) => {
            try {
                tokenFn().pipe(
                    take(1),
                ).subscribe(token => this.next(subMsg(token)));
            } catch (err) {
                observer.error(err);
            }

            const subscription = this.subscribe(
                (x) => {
                    try {
                        if (messageFilter(x)) {
                            observer.next(x);
                        }
                    } catch (err) {
                        observer.error(err);
                    }
                },
                (err) => observer.error(err),
                () => observer.complete()
            );

            return () => {
                try {
                    this.next(unsubMsg());
                } catch (err) {
                    observer.error(err);
                }
                subscription.unsubscribe();
            };
        });
    }

}
