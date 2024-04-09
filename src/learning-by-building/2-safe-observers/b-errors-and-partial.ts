import { Subscriber } from "rxjs";

/**
 * Adding error handling is as easy as adding an error handler on the Observer class.
 * Note that observables are stopped when an error occur!
 */

export interface Observer<T> {
  next: (value: T) => void;
  complete: () => void;
  error: (e: any) => void;
}

/**
 * A class used to wrap a user-provided Observer. Since the
 * observer is just a plain objects with a couple of callbacks on it,
 * this type will wrap that to ensure `next` does nothing if called after
 * `complete` has been called, and that nothing happens if `complete`
 * is called more than once.
 */
export class SafeObserver<T> {
  closed = false;

  constructor(private destination: Partial<Observer<T>>) {}

  next(value: T) {
    // Check to see if this is "closed" before nexting.
    if (!this.closed) {
      this.destination.next?.(value);
    }
  }

  complete() {
    // Make sure we're not completing an already "closed" subscriber.
    if (!this.closed) {
      // We're closed now.
      this.closed = true;
      this.destination.complete?.();
    }
  }

  error(err: any) {
    if (!this.closed) {
      this.closed = true;
      this.destination.error?.(err);
    }
  }
}

/**
 * A class to wrap our function, to ensure that when the function is
 * called with an observer, that observer is wrapped with a SafeSubscriber
 */
export class Observable<T> {
  constructor(private _wrappedFunc: (safeObserver: SafeObserver<T>) => void) {}

  subscribe(observer: Partial<Observer<T>>): void {
    // We can wrap our observer in a "safe subscriber" that
    // does the work of making sure it's not closed.
    const safeObserver = new SafeObserver(observer);
    this._wrappedFunc(safeObserver);
  }
}

/**
 * A definition to allow checking implementation details of the RxJS library.
 * Calling "new Subscriber()" is deprecated and should not be done in real code.
 */
function allowingCmdClick() {
  const s = new Subscriber();
  // cmd click on the "error" method to see implementation details: the flag "isStopped" is switched to true.
  s.error(new Error("checking error implementation details"));
}
