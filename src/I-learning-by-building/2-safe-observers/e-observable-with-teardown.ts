import { delay, map, of, switchMap } from "rxjs";
import { Observer } from "./b-errors-and-partial";

/**
 * Our subscription type. This is to manage teardowns.
 */
export class Subscription {
  private teardowns = new Set<() => void>();

  add(teardown: () => void) {
    this.teardowns.add(teardown);
  }

  unsubscribe() {
    for (const teardown of this.teardowns) {
      teardown();
    }
    this.teardowns.clear();
  }
}

export class SafeObserver<T> {
  closed = false;

  constructor(
    private destination: Partial<Observer<T>>,
    private subscription: Subscription
  ) {
    // Make sure that if the subscription is unsubscribed,
    // we don't let any more notifications through this subscriber.
    subscription.add(() => (this.closed = true));
  }

  next(value: T) {
    if (!this.closed) {
      this.destination.next?.(value);
    }
  }

  complete() {
    if (!this.closed) {
      this.closed = true;
      this.destination.complete?.();
      this.subscription.unsubscribe();
    }
  }

  error(err: any) {
    if (!this.closed) {
      this.closed = true;
      this.destination.error?.(err);
      this.subscription.unsubscribe();
    }
  }
}

export class Observable<T> {
  constructor(
    private _wrappedFunc: (safeObserver: SafeObserver<T>) => () => void
  ) {}

  subscribe(observer: Partial<Observer<T>>) {
    const subscription = new Subscription();
    const safeObserver = new SafeObserver(observer, subscription);
    // Adding the provided teardown logic to the subscription.
    // Note that this line starts the execution of the observable function!
    subscription.add(this._wrappedFunc(safeObserver));
    return subscription;
  }
}

const observable = new Observable<number>((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();

  return () => void 0;
});

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
