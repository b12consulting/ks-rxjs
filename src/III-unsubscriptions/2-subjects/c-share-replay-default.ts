import { interval, shareReplay, take, tap } from "rxjs";

const replayed = interval(1000).pipe(
  tap((index) => console.log(`tap console: ${index}`)),
  take(3),
  shareReplay(1)
);


/**
 * Unsubscribing after a shareReplay with refCount false (the default) leaks resources!
 */
replayed.pipe(take(3)).subscribe(console.log);





