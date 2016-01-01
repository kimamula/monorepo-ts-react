# Examining monorepo with lerna as well as my original gulp task

Here, classes and modules of the todo app in [ts-react](https://github.com/kimamula/ts-react/) are devided into npm packages, which are located under [packages dir](https://github.com/kimamula/monorepo-ts-react/tree/master/packages) to examine [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) with [lerna](https://github.com/kittens/lerna).

As the typescript declaration file of the dependee package must be provided prior to the compilation of the depender package, lerna's functionallity is not enough for me.
See [gulpfile.js](https://github.com/kimamula/monorepo-ts-react/blob/master/gulpfile.js) for detail.

## Usage

There are 4 npm scripts.

* bootstrap:
  * For each package, `npm link` the packages in this repository and `npm install` the other dependencies
  * Should be executed immediately after `npm install` at the repository root.
* build
  * Builds each package sequentially, in the order of dependency (from dependee to depender)
  * Should be executed after `bootstrap`
* build-app
  * Builds the todo app. If succeeded, the todo app can be used by opening index.html.
  * Should be executed after `build`
* release
  * `npm run build && lerna publish`
  * Should be executed after `bootstrap`
  * **CAUTION: This command actually publishes the packages to npm. If you want to examine how this works, you should prepare private npm registry.**
