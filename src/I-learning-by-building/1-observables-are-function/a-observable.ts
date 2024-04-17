import { Observable } from "rxjs";

/**
 * This is an example of a simple observable created with RxJS that emits three numbers and completes.
 * The "observable" variable could have been defined equivalently as "of(1, 2, 3)".
 * N.B.: in real code, using "new Observable" should be replaced by builtin constructor in most cases.
 */

const observable = new Observable<number>((observer) => {
  /**
   * You can wrap any combination of the lines in this function body in a "setTimeout".
   * So the execution context is arbitrary. As it stands here, this code is synchronous.
   */
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
