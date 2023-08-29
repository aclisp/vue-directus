/**
 * promisify()
 * Transforms callback-based function -- func(arg1, arg2 .. argN, callback) --
 * into an ES6-compatible Promise. Promisify provides a default callback of the
 * form (error, result) and rejects when `error` is truthy.
 *
 * @param {function} original - The function to promisify
 * @return {function} A promisified version of `original`
 */
export function promisify(original) {
  // Ensure the argument is a function
  if (typeof original !== "function") {
    throw new TypeError("Argument to promisify must be a function");
  }

  return function (object) {
    return new Promise((resolve, reject) => {
      // Rewrite the callback in object
      object.success = (res) => {
        resolve(res);
      };
      object.fail = (err) => {
        reject(err);
      };
      // Call the function.
      original.call(null, object);
    });
  };
}
