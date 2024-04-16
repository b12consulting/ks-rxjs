import { interval, shareReplay, take } from "rxjs";

/**
 * The documentation of shareReplay clearly documents why refCount is false by default.
 * Warning: I think most of the time we want to use refCount = true.
 * Note that when refCount is true, the source observable will be re-executed once the ref count drops to zero.
 */
const replayed = interval(1_000).pipe(
  shareReplay({ refCount: true, bufferSize: 2 })
);

replayed
  .pipe(take(6))
  .subscribe((value) => console.log(`subscription 1: ${value}`));

/**
 * When the 2nd subscriber subscribes, the ref count is 1.
 * So no new interval is created, and subscriber 2 receives the same emissions than subscriber 1
 * plus a buffer on subscription.
 */
setTimeout(
  () =>
    replayed
      .pipe(take(4))
      .subscribe((value) => console.log(`subscription 2: ${value}`)),
  3_500
);

/**
 * When the 3rd subscriber subscribes, the ref count had dropped to zero.
 * So it restarts a new interval, with no buffered value.
 */
setTimeout(
  () =>
    replayed
      .pipe(take(3))
      .subscribe((value) => console.log(`subscription 3: ${value}`)),
  10_000
);
