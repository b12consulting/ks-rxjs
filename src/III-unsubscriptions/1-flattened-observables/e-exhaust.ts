import { map, exhaustAll, exhaustMap, take } from "rxjs";
import { source, toInterval } from "./a-setup";

const higherOrder = source.pipe(map(toInterval));
/**
 * every time the "source" emits a value,
 * we create a new observable and subscribe to it only if the previous inner observaleb has already completed.
 * Otherwise, we just keep the subscription from the current inner observable.
 */
const exhaust1 = higherOrder.pipe(exhaustAll());

// equivalent "map + flatten"
const exhaust2 = source.pipe(exhaustMap(toInterval));

// as usual, unsubscribe after higher-order operators
exhaust1.pipe(take(10)).subscribe(console.log);
