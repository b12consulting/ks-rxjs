import { map, concatAll, concatMap, take } from "rxjs";
import { source, toInterval } from "./a-setup";

const higherOrder = source.pipe(map(toInterval));
/**
 * every time the "source" emits a value,
 * we create a new observable and put it in a queue of observables to subscribe to.
 * Everytime a previous innner observable completes, we start the next observable in the queue.
 * So inner observables are "concatenated" one after the other.
 */
const concat1 = higherOrder.pipe(concatAll());

// equivalent "map + flatten"
const concat2 = source.pipe(concatMap(toInterval));

// as usual, unsubscribe after higher-order operators
concat1.pipe(take(10)).subscribe(console.log);
