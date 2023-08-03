import 'reflect-metadata';
import { DECORATOR_KEY, DESIGN_TYPE_NAME, ERROR_MSG } from './constants';

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

  resolve<T>(token: ConstructorOf<T>): T {
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
    return this.resolveClassProvider({ token, useClass: token });
  }

  private resolveClassProvider<T>(provider: ClassProvider<T>): T {
    const injectableOpts = Reflect.getMetadata(DECORATOR_KEY.Injectable, provider.useClass) as InjectableOpts;
    if (!injectableOpts) throw new Error(ERROR_MSG.NO_INJECTABLE);
    const args = injectableOpts.deps.map(dep => this.resolve(dep));
    return new provider.useClass(...args);
  }

  private resolveValueProvider<T>(provider: ValueProvider<T>): T {
    return provider.useValue;
  }

  private resolveFactoryProvider<T>(provider: FactoryProvider<T>): T {
    return provider.useFactory(this);
  }

  register(...providers: Provider[]) {
    providers.forEach(provider => {
      this.providerMap.set(provider.token || provider, provider);
    });
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
