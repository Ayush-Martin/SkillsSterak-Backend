// This function binds all methods of a class instance to the instance itself.
function binder<T extends object>(instance: T): void {
  const proto = Object.getPrototypeOf(instance); // Get the prototype (methods) of the instance

  Object.getOwnPropertyNames(proto).forEach((methodName) => {
    const method = proto[methodName];
    if (typeof method === "function" && methodName !== "constructor") {
      // Bind the method to the instance
      instance[methodName as keyof T] = method.bind(instance);
    }
  });
}

export default binder;
