import { combineLatest, interval, map, share, take } from "rxjs";

// The min is inclusive, the max is exclusive
export function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export const source = interval(1000).pipe(
  map(() => getRandomInt(-10, 11)),
  share()
);
const isPositive = source.pipe(map((value) => value > 0));
const doubledNumbers = source.pipe(map((value) => value * 2));

if (require.main === module) {
  combineLatest([doubledNumbers, isPositive])
    .pipe(take(10))
    .subscribe(console.log);
}

/**
 * The problem we see here is because RxJS (like many frp) is "depth first".
 *              source
 *              /   \
 *             /     \
 *   doubledNumbers   isPositive
 *             \      /
 *              \    /
 *           combineLatest
 *
 * source emits => doubledNumbers sub => combineLatest sub => isPositive sub => combineLatest sub
 */
