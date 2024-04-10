import { Observable } from "rxjs";
import { fromArrayLike } from "rxjs/internal/observable/innerFrom";
/**
 * For the curious, here is the real implementation of "rxjs.of()",
 * which eventually calls "fromArrayLike" to do the real work.
 * RxJS "fromArrayLike" warns that "reentrant code can alter the array we're looping over".
 * Here is an illustration of the kind of bug this warning is about.
 */

const source = [1, 2, 3];

const observable = new Observable<number>((observer) => {
  // Note the usage of "for" loop instead of "forEach". This is for performance reasons, cfr.
  // https://benlesh.com/posts/forEach-is-a-code-smell/
  for (let i = 0; i < source.length; i++) {
    observer.next(source[i]);
  }
  observer.complete();
});

// Usage
console.log("start");
observable.subscribe({
  next: (value) => {
    console.log(value);
    source.push(-1);
  },
  complete: () => console.log("done"),
});
console.log("stop");

// Key takeway: ensure immutability at the type level, e.g.
const valueSourceReadonly1: readonly number[] = [1, 2, 3];
const valueSourceReadonly2: ReadonlyArray<number> = [1, 2, 3];
const valueSourceStronglyConstant = [1, 2, 3] as const;

/**
 * Now, the followings are compilation error (with either "valueSourceReadonly" or "valueSourceStronglyConstant");
 */
// valueSourceReadonly1.push(-1)
// valueSourceReadonly1[0] = -1;

/**
 * For the implementation detail of "fromArrayLike", cmd click on the following
 */
const x = fromArrayLike([1, 2, 3]);
