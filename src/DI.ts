import 'reflect-metadata';
import { DECORATOR_KEY, DESIGN_TYPE_NAME, ERROR_MSG, REFLECT_KEY } from './constants';

const ProviderAssertion = Object.freeze({
  isClassProvider(provider: Provider): provider is ClassProvider {
    return Reflect.has(provider, 'useClass');
  },
  isValueProvider(provider: Provider): provider is ValueProvider {
    return Reflect.has(provider, 'useValue');
  },
  isFactoryProvider(provider: Provider): provider is FactoryProvider {
    return Reflect.has(provider, 'useFactory');
  }
});

export class Container implements ContainerInterface {
  private providerMap = new Map<Token, Provider>();

  resolve<T>(token: Token<T>): T {
    token = this.resolveToken(token);
    const provider = this.providerMap.get(token);
    if (provider) {
      if (ProviderAssertion.isClassProvider(provider)) {
        return this.resolveClassProvider(provider);
      } else if (ProviderAssertion.isValueProvider(provider)) {
        return this.resolveValueProvider(provider);
      } else if (ProviderAssertion.isFactoryProvider(provider)) {
        return this.resolveFactoryProvider(provider);
      }
    }
    return this.resolveClassProvider({ token, useClass: token as ConstructorOf<T> });
  }

  private resolveToken(token: any) {
    return typeof token === 'object' ? token.forwardRef ? token.forwardRef() : token : token;
  }

  private resolveClassProvider<T>(provider: ClassProvider<T>): T {
    const injectableOpts = Reflect.getOwnMetadata(DECORATOR_KEY.Injectable, provider.useClass) as InjectableOpts;
    if (!injectableOpts) throw new Error(ERROR_MSG.NO_INJECTABLE);
    const args = injectableOpts.deps.map(dep => this.resolve(dep));
    const result = new provider.useClass(...args);
    result[REFLECT_KEY.Container] = this;

    this.applyProperties(result as object, provider.useClass);
    return result;
  }

  private resolveValueProvider<T>(provider: ValueProvider<T>): T {
    return provider.useValue;
  }

  private resolveFactoryProvider<T>(provider: FactoryProvider<T>): T {
    return provider.useFactory(this);
  }

  private applyProperties(instance: object, target: ConstructorOf<any>) {
    const tokenMap = Reflect.getMetadata(DECORATOR_KEY.InjectProperty, target);
    const properties = tokenMap ? [...tokenMap.entries()].map(([key, token]) => {
      return { key, token };
    }) : [];
    properties.forEach(({ key, token }) => {
      let depInstance: any;
      Reflect.defineProperty(instance as object, key, {
        get() {
          return depInstance || (depInstance = this[REFLECT_KEY.Container].resolve(token));
        }
      });
    });
  }

  register(...providers: Provider[]) {
    providers.forEach(provider => {
      this.providerMap.set(provider.token || provider, provider);
    });
  }
}

export function Injectable<T>() {
  return function (target: ConstructorOf<T>) {
    const deps = Reflect.getMetadata(DESIGN_TYPE_NAME.ParamType, target) || [];

    const tokenMap: Map<number, Token> = Reflect.getMetadata(DECORATOR_KEY.InjectParameter, target);
    if (tokenMap) {
      [...tokenMap.entries()].forEach(([index, token]) => {
        deps[index] = token;
      });
    }

    const injectableOpts = { deps };
    Reflect.defineMetadata(DECORATOR_KEY.Injectable, injectableOpts, target);
  };
}

export function forwardRef<T>(fn: () => T) {
  return {
    forwardRef: fn
  } as unknown as Token;
}

// 标记参数依赖
export function Inject(token: Token) {
  return function (target: ConstructorOf<any> | object, key?: string | symbol, index?: number): any {
    if (typeof index === 'number') {
      return parameterDecorator(target as ConstructorOf<any>, index, token);
    } else {
      return propertyDecorator(target as object, key!, token);
    }
  };
}

function parameterDecorator(target: ConstructorOf<any>, index: number, token: Token) {
  const tokenMap: Map<number, Token> = Reflect.getOwnMetadata(DECORATOR_KEY.InjectParameter, target) || new Map();
  tokenMap.set(index, token);
  Reflect.defineMetadata(DECORATOR_KEY.InjectParameter, tokenMap, target);
}

function propertyDecorator(target: object, key: string | symbol, token: Token) {
  const tokenMap: Map<string | symbol, Token> = Reflect.getOwnMetadata(DECORATOR_KEY.InjectProperty, target.constructor) || new Map();
  tokenMap.set(key, token);
  Reflect.defineMetadata(DECORATOR_KEY.InjectProperty, tokenMap, target.constructor);
}
