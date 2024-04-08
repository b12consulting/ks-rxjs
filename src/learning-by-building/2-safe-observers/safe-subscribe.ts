interface Observer<T> {
  next: (value: T) => void;
  complete: () => void;
}

/**
 * A class used to wrap a user-provided Observer. Since the
 * observer is just a plain objects with a couple of callbacks on it,
 * this type will wrap that to ensure `next` does nothing if called after
 * `complete` has been called, and that nothing happens if `complete`
 * is called more than once.
 */
class SafeObserver<T> {
  closed = false;

  constructor(private destination: Observer<T>) {}

  next(value: T) {
    // Check to see if this is "closed" before nexting.
    if (!this.closed) {
      this.destination.next(value);
    }
  }

  complete() {
    // Make sure we're not completing an already "closed" subscriber.
    if (!this.closed) {
      // We're closed now.
      this.closed = true;
      this.destination.complete();
    }
  }
}

/**
 * A class to wrap our function, to ensure that when the function is
 * called with an observer, that observer is wrapped with a SafeSubscriber
 */
class Observable<T> {
  constructor(private _wrappedFunc: (safeObserver: SafeObserver<T>) => void) {}

  subscribe(observer: Observer<T>): void {
    // We can wrap our observer in a "safe subscriber" that
    // does the work of making sure it's not closed.
    const safeObserver = new SafeObserver(observer);
    this._wrappedFunc(safeObserver);
  }
}

// Usage
// Now 4 won't be nexted after we complete.
export const source = new Observable<number>((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
  observer.next(4); // this does nothing.
});

source.subscribe({ next: console.log, complete: () => console.log("done") });
