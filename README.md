# valtech\_shortie

Valtech URL shortener

TODO:
* UI tests
* UI
* DB handler interface
* Choose your Database! Mongo? (or Postgres? :-()
* Grunt for running tests and etc
* OAuth for signin
* Cookie authorization for API with CSRF token to prevent illicit usage
* Auth for external applications (static auth tokens)


# Dev

## Prerequisites

### For all platforms

 * Node.js: http://nodejs.org/
 * Grunt: `sudo npm install -g grunt`

### For Windows development

 * Visual Studio 2013
 * Something something...

## Running

    npm install
    node src/app.js

With [node-supervisor](https://github.com/isaacs/node-supervisor):

    supervisor src/app.js

## Tests

To run unit tests and jshint:

    grunt
