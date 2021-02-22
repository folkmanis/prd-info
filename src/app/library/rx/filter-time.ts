import { MonoTypeOperatorFunction, pipe } from 'rxjs';
import { filter, tap, finalize } from 'rxjs/operators';

/**
 * emits first element, then skips for set milliseconds
 * next element is emmited not earlier than after delay
 *
 * @param delay: dealy time in milliseconds
 */
export const filterTime: <T>(delay: number) => MonoTypeOperatorFunction<T> =
    (delay) => {
        let skip = false;
        let timeout: number | undefined;
        return pipe(
            filter(_ => !skip),
            tap(_ => {
                skip = true;
                timeout = window.setTimeout(() => skip = false, delay);
            }),
            finalize(() => window.clearTimeout(timeout)),
        );
    };
