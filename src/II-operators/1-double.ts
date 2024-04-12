import {
  Observable,
  observable,
} from "../I-learning-by-building/2-observables-enhancement/e-observable-with-teardown";

const double = (source: Observable<number>) =>
  new Observable((subscriber) => {
    const subscription = source.subscribe({
      // Here we alter our value and "send it along" to our consumer.
      next: (value) => subscriber.next(2 * value),
      // We have to make sure errors and completions are also forwarded to the consumer.
      error: (err) => subscriber.error(err),
      complete: () => subscriber.complete(),
    });
    return () => {
      // We must make sure to tear down our subscription.
      // when the returned observable is finalized.
      subscription.unsubscribe();
    };
  });

console.log("start");
double(observable).subscribe({ next: console.log });
console.log("stop");

/**
 * Note: in RxJS, operators are applied via the pipe method:
 * observable.pipe(op1, op2) -> eventually transformed to -> op2(op1(observable)).
 * It is recommended to always use "pipe", even when having only one operator, see
 * https://rxjs.dev/guide/operators#piping
 */

/**
 * The way we defined double is the recommended way to write RxJS operator by hand:
 * use "new Observable" to return a new Observable, and handle the teardown logic by hand.
 * See https://rxjs.dev/guide/operators#creating-new-operators-from-scratch.
 * This should almost never be necessary, as most operators are already defined in RxJS.
 */

/**
 * talk about channels as presented in https://benlesh.com/posts/rxjs-operators-in-depth-part-2/
 * talk about higher-order observables
 */
