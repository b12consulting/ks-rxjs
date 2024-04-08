/**
 * A simple object with a `next` and `complete` callback on it.
 */
interface Observer<T> {
  next: (value: T) => void;
  complete: () => void;
}

/**
 * A function that takes a simple object with callbacks
 * and does something with them.
 */
export const source = (observer: Observer<number>) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
};

// Usage
console.log("start");
source({
  next: console.log,
  complete: () => console.log("done"),
});
console.log("stop");
