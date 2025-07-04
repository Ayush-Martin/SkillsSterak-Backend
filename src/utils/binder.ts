/**
 * Ensures all class methods are bound to the instance, preserving 'this' context.
 * - Prevents bugs when passing methods as callbacks or event handlers in TypeScript/JavaScript classes.
 * - Should be called in the constructor of any class that relies on method binding.
 *
 * @param instance - The instance of the class whose methods should be bound
 */
function binder<T extends object>(instance: T): void {
  const proto = Object.getPrototypeOf(instance);

  Object.getOwnPropertyNames(proto).forEach((methodName) => {
    const method = proto[methodName];

    // Bind all prototype methods except the constructor to the instance
    if (typeof method === "function" && methodName !== "constructor") {
      instance[methodName as keyof T] = method.bind(instance);
    }
  });
}

export default binder;
