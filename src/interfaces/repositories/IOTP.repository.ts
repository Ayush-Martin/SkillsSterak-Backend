export interface IOTPRepository {
  get(key: string): Promise<string | null>;
  set(key: string, expiry: number, value: string): Promise<void>;
  del(key: string): Promise<void>;
}
