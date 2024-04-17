import {
  ReplaySubject,
  interval,
  map,
  share,
  switchMap,
  take,
  withLatestFrom,
} from "rxjs";
import { getRandomInt } from "./1-diamond-problem";

// The min is inclusive, the max is exclusive
/* function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
} */

const source = interval(1000).pipe(
  map(() => getRandomInt(-10, 11)),
  /**
   * "share" with connector "ReplaySubject(n)" is for most purposes equivalent to
   * "shareReplay({ bufferSize: 1, refCount: true })".
   * "share" has "resetOnComplete=true", and not ShareReplay,
   * but we very rarely manually complete the connecting subject.
   */
  share({ connector: () => new ReplaySubject<number>(1) })
  //shareReplay({ bufferSize: 1, refCount: true })
);

const isPositive = source.pipe(map((value) => value > 0));
const doubledNumbers = source.pipe(map((value) => value * 2));

// "as const" allow more precies type inference
doubledNumbers
  .pipe(
    switchMap((num) => isPositive.pipe(map((bool) => [num, bool] as const))),
    take(10)
  )
  .subscribe(console.log);

// Other solution: "withLatestFrom"
/* doubledNumbers
  .pipe(withLatestFrom(isPositive), take(10))
  .subscribe(console.log); */
