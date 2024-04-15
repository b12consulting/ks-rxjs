import { map, mergeAll, mergeMap, take } from "rxjs";
import { source, toInterval } from "./a-setup";



const higherOrder = source.pipe(map(toInterval));
/**
 * Merging all observed values.
 * i.e. every time the "source" emits a value, we subscribe to a new "toInterval" observable.
 * Previous subscriptions live on, so everything is "merged".
 */
const merge = higherOrder.pipe(mergeAll());

// equivalent "map + flatten"
const merge2 = source.pipe(mergeMap(toInterval));

// the higher order observable just emits observable objects
// most of the time not useful for the end user
higherOrder.pipe(take(3)).subscribe(console.log)


// unsubscribing at the end of the operator chain will unsubscribe from all
// observables up the chain. That's what we want in general.
//merge.pipe(take(10)).subscribe(console.log);

// Unsubscribing before the mergeMap does not unsubscribe from the inner observables.
// Key take away: in angular, always put your "takeUnitDestroyed" after all "map+flatten operators!"
//source.pipe(take(3), mergeMap(toInterval)).subscribe(console.log);
