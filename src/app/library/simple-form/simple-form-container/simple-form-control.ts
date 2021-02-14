import { SimpleFormSource } from '../simple-form-source';

export abstract class SimpleFormControl<T> {
    abstract formSource: SimpleFormSource<T>;
    abstract writeValue(obj: T): void;
}
