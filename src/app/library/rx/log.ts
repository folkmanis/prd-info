import { pipe, MonoTypeOperatorFunction } from 'rxjs';
import { tap } from 'rxjs/operators';

export const log: <T>(message: string) => MonoTypeOperatorFunction<T> = message => {
    return pipe(
        tap(obj => console.log(message, obj)),
    );
};
