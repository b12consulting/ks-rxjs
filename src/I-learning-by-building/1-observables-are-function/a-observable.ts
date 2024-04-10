import { Observable } from "rxjs";

/**
 * This is an example of a simple observable created with RxJS that emits three numbers and completes.
 * The "observable" variable could have been defined equivalently as "of(1, 2, 3)".
 */

const observable = new Observable<number>((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
});

// Usage
console.log("start");
observable.subscribe({
  next: console.log,
  complete: () => console.log("done"),
});
console.log("stop");