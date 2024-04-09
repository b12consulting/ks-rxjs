interface Observer<T> {
  next: (value: T) => void;
  complete: () => void;
}

class Observable<T> {
  constructor(private func: (observer: Observer<T>) => void) {}

  subscribe(observer: Observer<T>): void {
    this.func(observer);
  }
}

// Usage
export const observable = new Observable<number>((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
});

console.log("start");
observable.subscribe({
  next: console.log,
  complete: () => console.log("done"),
});
console.log("stop");
