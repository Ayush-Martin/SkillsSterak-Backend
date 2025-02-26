export interface IBaseRepository<T> {
  findAll(): Promise<Array<T>>;
  findById(id: string): Promise<T | null>;
  updateById(id: string, data: Partial<T>): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  deleteById(id: string): Promise<void>;
}
