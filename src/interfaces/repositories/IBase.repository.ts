/**
 * Generic repository interface for CRUD operations.
 * Promotes consistency and reusability across data access layers.
 */
export interface IBaseRepository<T> {
  /**
   * Retrieves all items of type T from the data source.
   * Useful for listing resources or bulk operations.
   */
  findAll(): Promise<Array<T>>;

  /**
   * Finds a single item by its unique identifier.
   * Returns null if the item does not exist, supporting safe lookups.
   */
  findById(id: string): Promise<T | null>;

  /**
   * Updates an item by its ID with the provided partial data.
   * Enables partial updates without requiring full object replacement.
   */
  updateById(id: string, data: Partial<T>): Promise<T | null>;

  /**
   * Creates a new item in the data source.
   * Accepts partial data to support flexible creation scenarios.
   */
  create(data: Partial<T>): Promise<T>;

  /**
   * Deletes an item by its unique identifier.
   * Used for resource cleanup and enforcing data lifecycle policies.
   */
  deleteById(id: string): Promise<void>;
}
