# valtech\_shortie - valte.ch

Valtech URL shortening service. Runs on Heroku.

## TODO

### Epics

1. Connect UI with backend API
2. Implement RedirectRepository
3. Integrate with Mongo
4. Write UI tests (CasperJS?)
5. Set up TeamCity build config
6. Remove generated files from repo (compiled JS/CSS/etc)
7. Auth for external applications (static auth tokens)

### Small fixes

1. Rename all 'redirect' types/functions to 'shortie'

# API

TODO. Will require an "application key + secret". POST, PUT and DELETE. JSON data.

# Admin

Go to `/admin` and login using vauth. You can administer existing URLs and add new ones.


# Dev

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

#### With grunt watch and [node-supervisor](https://github.com/isaacs/node-supervisor)

Tab A:

    grunt default watch

Tab B:

    supervisor src/server.js

#### Debugging with [node-inspector](https://github.com/node-inspector/node-inspector)

    grunt
    node-debug src/server.js

#### Running/debugging with Visual Studio 2013

Just open valtech_shortie.sln, build and press F5! :-)

## Grunt tasks

When running `grunt` without arguments, the following tasks are executed in order:

* **npm-install:** installs all NPM dependencies
* **build:** compiles TypeScript into JavaScript
* **browserify:** uses [browserify](http://browserify.org) to bundle frontend JS
* **test:** runs all Mocha tests in test/
* **jshint:** runs JsHint on all JavaScript files in src/

You can also run `grunt watch` to make grunt run the commands when files change.

