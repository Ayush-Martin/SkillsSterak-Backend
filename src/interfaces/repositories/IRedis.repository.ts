export interface IRedisRepository {
  get(key: string): Promise<string | null>;
  setWithExpiry(key: string, expiry: number, value: string): Promise<void>;
  set(key: string, value: string): Promise<void>;
  del(key: string): Promise<void>;
}
