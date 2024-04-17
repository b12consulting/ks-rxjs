import { map, merge, take } from "rxjs";
import { source } from "./1-diamond-problem";

const tens = source.pipe(map((value) => value * 10));
const hundreds = tens.pipe(map((value) => value * 10));

merge(hundreds, tens).pipe(take(10)).subscribe(console.log);

/**
 * Philosophically, "hundreds" is defined based on "tens",
 * so one might argue that "hundreds" should emit after "tens".
 * 
 * Of course, RxJS does not make this kind of considerations.
 * The output order of "merge" is solely determined by the argument order.
 */
