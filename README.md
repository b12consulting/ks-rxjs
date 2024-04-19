# How to run the code

To install dependencies, run

```
nvm use 20
npm ci
```

To execute the code in any of the files, run

```
npx ts-node path/to/file.ts
```

# Code organisation

In "I-learning-by-building" and "II-operators", we rebuild the RxJS library from scratch without relying in any way on RxJS.

Starting from "III-unsubscriptions", we use the RxJS library.

# Debugging examples

Debugging can be difficult when executing code with ts-node, because errors are sometimes hidden by ts-node execution.
Normally, ts-node uses source maps by default, so errors should be mapped to the origin line in your ts file.
But sometimes errors are hidden behind the source map execution, even if you disable source map in the tsconfig.json!

In that case, a workaround is to compile your code to javascript and execute the javascript file directly.

```
npx tsc
node dir/<path-to-file>/filename.js
```

# Acknowledgments

Most of the content in the directory "I-learning-by-building" is taken from Ben Lesh blog post
https://benlesh.com/posts/learning-observable-by-building-observable/. I have tweaked quite a few things here and there in the hope of making the content clearer.

The code in II-operators/1-double.ts is taken from https://benlesh.com/posts/rxjs-operators-in-depth-part-1/

Parts of III-unsubscriptions/2-subjects/a-hot-vs-cold.ts is taken from https://benlesh.medium.com/hot-vs-cold-observables-f8094ed53339.

"IV-common-frp-glitches" is adapted from https://github.com/raquo/Airstream?tab=readme-ov-file#frp-glitches.
