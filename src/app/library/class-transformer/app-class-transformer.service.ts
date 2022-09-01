import { Injectable } from '@angular/core';
import { ClassTransformer, ClassConstructor, ClassTransformOptions } from 'class-transformer';
import { map, OperatorFunction } from 'rxjs';

export * from 'class-transformer';

@Injectable({
  providedIn: 'root'
})
export class AppClassTransformerService extends ClassTransformer {

  plainToInstance<T extends Record<string, any>, V extends any[]>(cls: ClassConstructor<T>, plain: V, options?: ClassTransformOptions): T[];
  plainToInstance<T extends Record<string, any>, V>(cls: ClassConstructor<T>, plain: V, options?: ClassTransformOptions): T;
  plainToInstance<T extends Record<string, any>>(cls: ClassConstructor<T>, plain: unknown, options: ClassTransformOptions = {}): T | T[] {
    options = {
      exposeDefaultValues: true,
      ...options,
    };
    return super.plainToInstance(cls, plain, options);
  }

  toClass<T extends Record<string, any>, V extends Array<any>, U = T[]>(obj: ClassConstructor<T>, options?: ClassTransformOptions): OperatorFunction<V, U>;
  toClass<T extends Record<string, any>, V, U = T>(obj: ClassConstructor<T>, options?: ClassTransformOptions): OperatorFunction<V, U>;
  toClass<T extends Record<string, any>, V>(obj: ClassConstructor<T>, options?: ClassTransformOptions): OperatorFunction<V, T | T[]> {
    return map((data) => this.plainToInstance(obj, data, options));
  }


}
