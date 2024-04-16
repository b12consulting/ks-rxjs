import { connectable, interval, take } from "rxjs";

/**
 * To turn an observable into a hot one, use one of the following
 * - the "connectable" function
 * - the "connect" operator
 * - the "share" operator
 *
 * (side note: "shareReplay" is just syntactic sugar to call "share")
 */

const coldObservable = interval(1000);
const hotObservable = connectable(coldObservable);

/**
 * Usage example: different subscriptions receive the same values
 */
hotObservable
  .pipe(take(5))
  .subscribe((value) => console.log(`sub 1 value: ${value}`));
setTimeout(
  () =>
    hotObservable
      .pipe(take(3))
      .subscribe((value) => console.log(`sub 2 value: ${value}`)),
  3000
);

// late subscription with a restart (see "resetOnDisconnect" in "ConnectableConfig")
setTimeout(() => {
  connection.unsubscribe();
  hotObservable
    .pipe(take(3))
    .subscribe((value) => console.log(`sub 3 value: ${value}`));
  connection = hotObservable.connect();
}, 10_000);

let connection = hotObservable.connect();
setTimeout(() => connection.unsubscribe(), 13_000);

/**
 * Managing connection by hand is not advisable.
 * Use the highly customizable "share()" operator in production code.
 */
