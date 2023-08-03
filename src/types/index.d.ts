declare type ConstructorOf<T> = new (...args: any[]) => T

// deps analyze result type
declare type InjectableOpts = { deps: ConstructorOf<any>[] }

declare interface ContainerInterface {
  resolve<T>(target: ConstructorOf<T>): T;

  register(...args: Provider[]): void;
}

// the unique key of dep
declare type Token<T = any> = string | symbol | ConstructorOf<T>

type WithToken<T> = { token: Token<T> }

declare type ClassProvider<T = any> = WithToken<T> & {
  useClass: ConstructorOf<T>
}

declare type ValueProvider<T = any> = WithToken<T> & {
  useValue: T
}

declare type FactoryProvider<T = any> = WithToken<T> & {
  useFactory: (c: ContainerInterface) => T
}

declare type Provider = ClassProvider | ValueProvider | FactoryProvider | ConstructorOf

