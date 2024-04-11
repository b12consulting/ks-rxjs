import { interval, map } from "rxjs";
/**
 * A higher-order observable is an observable of observables.
 * This comes up very regularly when working with observables:
 * every time to map an observable value to another observable,
 * you will get an observable of observable. E.g.:
 * const fileObservable = urlObservable.pipe(map((url) => http.get(url)));
 *
 * But in 99.9% of the case, we want to "flatten" the higher-order observable to an observable.
 * Note the analogy with "flattening" an array of arrays into an array.
 * This analogy stems from the fact that both "Array" and "Observable" are Monads.
 * In the case of arrays, there is only one sensible way to flatten an array of arrays.
 * But for observables, there are various sensible strategies, let's give a few of them.
 */

export const source = interval(3000);
export const toInterval = (outerIndex: number) =>
  interval(1000).pipe(map((innerIndex) => [outerIndex, innerIndex]));
