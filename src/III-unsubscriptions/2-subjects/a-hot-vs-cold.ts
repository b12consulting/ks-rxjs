import { Observable, Subject, interval, takeUntil, timer, share } from "rxjs";
/**
 * Observable just link a "producer" to an "observer".
 * Question: do you want to restart the producer when subscribing or not?
 * If yes, the observable is "cold". If not, the observable is "hot".
 */

/**
 * Example of cold observable: do not close over the producer.
 * The socket example (I.2.c) is another cold example:
 * every subscriber receives its own new socket connection!
 */
const producer = interval(1000);

const coldObservable = new Observable((observer) => {
  const subscription = producer.subscribe(observer);
  return () => {
    subscription.unsubscribe();
  };
});

/**
 * every subscription to this would receive different values, e.g.
 * coldObservable.subscribe(console.log);
 * coldObservable.subscribe(console.log);
 */

/**
 * To make it hot, we need a new type: Subject. Subjects are:
 * 1. Observables: can subscribe to them as for Observables.
 * 2. Observers: They have the "next, error, complete" channels.
 * 3. Multicasts: all observers passed to it via `subscribe()` are added to an internal observers list.
 * 4. Passes value through itself: Subject.next() values are passed to subscribed observers.
 */
const hotProducer = new Subject();
/**
 * Red flag: we do not have a teardown/unsubscription on this subscription.
 * Do not try to do this manually in production code (use the "share" operator instead).
 */
producer.subscribe(hotProducer);

const hotObservable = new Observable((observer) => {
  const subscription = hotProducer.subscribe(observer);
  return () => {
    subscription.unsubscribe();
  };
});

/**
 * Usage example: different subscriptions receive the same values
 */
hotObservable
  .pipe(takeUntil(timer(10_000)))
  .subscribe((value) => console.log(`sub 1 value: ${value}`));
setTimeout(
  () =>
    hotObservable
      .pipe(takeUntil(timer(10_000)))
      .subscribe((value) => console.log(`sub 2 value: ${value}`)),
  3000
);

setTimeout(() => {
  hotProducer.complete();
}, 6000);
