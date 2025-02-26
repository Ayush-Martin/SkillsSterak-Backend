export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  create(data: T): Promise<T>;
  deleteById(id: string): Promise<void>;
}
