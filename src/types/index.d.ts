declare type ConstructorOf<T> = new (...args: any[]) => T

declare type InjectableOpts = { deps: ConstructorOf<any>[] }
