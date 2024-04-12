import { observable } from "./e-observable-with-teardown";

// Usage
console.log("start");
const subscription = observable.subscribe({
  next: console.log,
  complete: () => console.log("done"),
});
/**
 * Useless call, unsubscribe has already been called.
 * But try it out with an asynchronous version of "observable".
 */
subscription.unsubscribe();
console.log("stop");
