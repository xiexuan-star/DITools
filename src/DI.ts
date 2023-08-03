import 'reflect-metadata';
import { DECORATOR_KEY, DESIGN_TYPE_NAME, ERROR_MSG } from './constants';

export class Container {
  resolve<T>(target: ConstructorOf<T>): T {
    const injectableOpts = Reflect.getMetadata(DECORATOR_KEY.Injectable, target) as InjectableOpts;
    if (!injectableOpts) throw new Error(ERROR_MSG.NO_INJECTABLE);
    const args = injectableOpts.deps.map(dep => this.resolve(dep));
    return new target(...args);
  }
}

// 标记依赖
export function Injectable<T>() {
  return function (target: ConstructorOf<T>) {
    const deps = Reflect.getMetadata(DESIGN_TYPE_NAME.ParamType, target) || [];
    const injectableOpts = { deps };
    Reflect.defineMetadata(DECORATOR_KEY.Injectable, injectableOpts, target);
  };
}
