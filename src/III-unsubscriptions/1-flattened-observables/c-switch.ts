import { map, switchAll, switchMap, take } from "rxjs";
import { source, toInterval } from "./a-setup";

const higherOrder = source.pipe(map(toInterval));
/**
 * every time the "source" emits a value,
 * we first unsubscribe form the previous "toInterval" observable
 * then subscribe to the a new "toInterval" observable.
 * So we "switch" from the previous inner observable to the new one.
 */
const switch1 = higherOrder.pipe(switchAll())

// equivalent "map + flatten"
const switch2 = source.pipe(switchMap(toInterval));

// as usual, unsubscribe after higher-order operators
switch1.pipe(take(10)).subscribe(console.log);
