import $ from 'jquery';
/**
 * Promise Caching
 *
 * If you are attempting to cache a POST request, rethink what you are doing :)
 *
 * Returns an existing promise if it's already
 * was requested or creates a new one and put it
 * to promises cache.
 *
 * Recreates promise in a cache if shouldFetch == true.
 * Calling fn() with the result promise as an argument
 * and returning result promise.
 *
 * @return null if name or function is not passed.
 */
const promises = {};

export function getPromise(name, fn, shouldFetch) {

    if (!name || !fn) {
        return null;
    }
    let promise = promises[name];
    if (promise && !shouldFetch) {
        return promise;
    }
    promise = promises[name] = $.Deferred();
    fn(promise);
    return promise;
}

export function invalidatePromise(name) {
  promises[name] = null;
}

export function invalidatePromiseWithPrefix(prefix) {
  for (const key in promises) {
    if (key.startsWith(prefix)) {
      promises[key] = null;
    }
  }
}
