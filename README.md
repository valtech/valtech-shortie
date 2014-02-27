# valtech\_shortie

Valtech URL shortening service.

## TODO

* UI tests
* UI
* Choose your Database! Mongo? (or Postgres? :-()
* OAuth for signin
* Cookie authorization for API with CSRF token to prevent illicit usage
* Auth for external applications (static auth tokens)


## Prerequisites

### For all platforms

 * Node.js: http://nodejs.org/
 * Grunt: `npm install -g grunt grunt-cli`

### For Windows development with Visual Studio

 * Visual Studio 2013
 * Node.js Tools for Visual Studio: https://nodejstools.codeplex.com/

## Running

#### (First time)

This will install all required Node modules. 

    npm install

#### From CLI 

    grunt
    node src/server.js

#### With [node-supervisor](https://github.com/isaacs/node-supervisor)

    grunt
    supervisor src/server.js

#### Debugging with [node-inspector](https://github.com/node-inspector/node-inspector)

    grunt
    node-debug src/server.js

#### Running/debugging with Visual Studio 2013

Just open valtech_shortie.sln, build and press F5! :-)

## Grunt tasks

When running grunt without arguments, the following tasks are executed in order:

* **npm-install:** installs all NPM dependencies
* **build:** compiles TypeScript into JavaScript
* **test:** runs all Mocha tests in test/
* **jshint:** runs JsHint on all JavaScript files in src/