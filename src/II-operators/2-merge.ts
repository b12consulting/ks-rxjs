import {
  Observable,
  Subscription,
} from "../I-learning-by-building/2-safe-observers/e-observable-with-teardown";

const interval = (ms: number) =>
  new Observable<number>((observer) => {
    let index = 0;
    const intervalId = setInterval(() => observer.next(index++), ms);

    return () => clearInterval(intervalId);
  });

/**
 * A simple minded implementation of the rxjs operator instance "mergeMap(() => interval(1000))".
 * Note that in the implementation of mergeMap, the RxJS library must somewhere take care of unsubscribing all inner subscriptions.
 * Unfortuntely, I couldn't quite track down where this actually happen.
 */
const mergeInterval = (source: Observable<number>) =>
  new Observable((observer) => {
    const innerSubs: Subscription[] = [];
    const subscription = source.subscribe({
      // Every time we receive a new value, we subscribe to a new interval.
      next: () =>
        innerSubs.push(
          interval(1_000).subscribe({
            next: (innerValue) => observer.next(innerValue),
          })
        ),
      // We have to make sure errors and completions are also forwarded to the consumer.
      error: (err) => observer.error(err),
      complete: () => observer.complete(),
    });
    return () => {
      innerSubs.forEach((innerSub) => innerSub.unsubscribe());
      subscription.unsubscribe();
    };
  });

const sub = mergeInterval(interval(3_000)).subscribe({ next: console.log });
setTimeout(() => sub.unsubscribe(), 13_000);
