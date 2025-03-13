/**
 * Binds methods to the instance of the class.
 * This is useful for TypeScript classes since methods are not automatically bound to the instance.
 * @param instance - The instance of the class
 */
function binder<T extends object>(instance: T): void {
  const proto = Object.getPrototypeOf(instance);

  Object.getOwnPropertyNames(proto).forEach((methodName) => {
    const method = proto[methodName];

    if (typeof method === "function" && methodName !== "constructor") {
      instance[methodName as keyof T] = method.bind(instance);
    }
  });
}

export default binder;
