/** Interface for basic repository operations */
export interface IBaseRepository<T> {
  /** Retrieve all items */
  findAll(): Promise<Array<T>>;
  /** Find an item by ID */
  findById(id: string): Promise<T | null>;
  /** Update an item by ID */
  updateById(id: string, data: Partial<T>): Promise<T | null>;
  /** Create a new item */
  create(data: Partial<T>): Promise<T>;
  /** Delete an item by ID */
  deleteById(id: string): Promise<void>;
}
