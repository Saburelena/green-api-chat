import { GreenApiClient } from '@/shared/api/GreenApiClient';
import type { IGreenApiClient } from '@/shared/api/IGreenApiClient';
import type { Credentials } from '@/shared/types/greenApi';

import { TOKENS } from './tokens';

type Factory<T> = (creds: Credentials) => T;

class DIContainer {
  private readonly factories = new Map<symbol, Factory<unknown>>();
  private readonly cache = new Map<string, unknown>();

  register<T>(token: symbol, factory: Factory<T>): void {
    this.factories.set(token, factory as Factory<unknown>);
  }

  resolve<T>(token: symbol, creds: Credentials): T {
    const key = `${String(token)}::${creds.idInstance}::${creds.apiTokenInstance}`;
    if (this.cache.has(key)) return this.cache.get(key) as T;

    const factory = this.factories.get(token);
    if (!factory) throw new Error(`No factory for token ${String(token)}`);

    const instance = factory(creds) as T;
    this.cache.set(key, instance);
    return instance;
  }
}

export const container = new DIContainer();

container.register<IGreenApiClient>(
  TOKENS.GreenApiClient,
  (creds) => new GreenApiClient(creds),
);
