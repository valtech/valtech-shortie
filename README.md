# valtech\_shortie - valte.ch

Valtech URL shortening service.

# TL;DR

 * Production: http://valte.ch - admin: http://valte.ch/admin
 * Stage: http://stage.valte.ch - admin: http://stage.valte.ch/admin



# Technical stuff

This list isn't exhaustive, but should give you an idea of the overall architecture.

## Languages/tools/frameworks

### General

* JavaScript
* TypeScript ([http://www.typescriptlang.org/]())
* HTML 5
* CSS 3  
* Grunt (task runner) ([http://gruntjs.com/]())
* JSHint (JavaScript linter) ([http://www.jshint.com/]())
* Browserify ([http://browserify.org/]())
	* (Bundles CommonJS modules into AMD modules for the browser)
* Concat ([https://github.com/knicklabs/node-concat]())
	* (Simple tool for concatenating files. Used for CSS bundling.)

### Frontend

* Bootstrap 3 ([http://getbootstrap.com/]())
* Knockout ([http://knockoutjs.com/]())
* jQuery ([http://jquery.org/]())
	* (Only explicitly used for making AJAX calls to the REST API)
* Underscore.js ([http://underscorejs.org/]())

### Backend

* Node.JS ([http://nodejs.org/]())
* Express web framework ([http://expressjs.com/]())
* Jade templating engine ([http://jade-lang.com/]())
* Winston logging library ([https://github.com/flatiron/winston]())
* Underscore.js ([http://underscorejs.org/]())
* MongoDB ([http://www.mongodb.org]())
* NeDB ([https://github.com/louischatriot/nedb]())
	* (embedded database used for unit tests)
* client-sessions ([https://github.com/mozilla/node-client-sessions]())
	* (middleware for creating encrypted session cookies)
* New Relic ([http://www.newrelic.com/]())
	* (cloud service for performance metrics)
* **TBD:** Logentries ([http://logentries.com/]())
	* (cloud service for parsing/managing logs - currently only under evaluation...)

### Test frameworks

* Mocha ([http://visionmedia.github.io/mocha/]()) for BDD/unit testing
* Chai ([https://chaijs.com/]()) for assertions
* Sinon ([https://sinonjs.org/]()) for mocking
* Supertest ([https://github.com/visionmedia/supertest]()) for testing HTTP requests


# Admin

Go to `/admin` and login using vauth. You can administer existing URLs and add new ones.


# API

TODO. Will require an "application key + secret". POST, PUT and DELETE. JSON data.


# Deployment

valtech\_shortie is deployed with our internal TeamCity instance:
http://bob.valtech.se.

 * Branch `master` is automatically deployed to production.
 * Branch `develop` is automatically deployed to stage.

The application is deployed to Azure. The azure-site-names are:

 * Production: http://valtech-shortie.azurewebsites.net
 * Stage: http://stage-valtech-shortie.azurewebsites.net

The MongoDB databases are located at [MongoHQ](https://app.mongohq.com/). Ask IT for access.


# Dev

## Prerequisites

### For all platforms

 * Node.js: http://nodejs.org/ (use official installer)
 * Grunt: `npm install -g grunt grunt-cli`
 * MongoDB
   * Mac OS X: `brew install mongodb` and run it with `mongod`
   * Windows: Download, unzip somewhere (e.g. `C:\mongodb`), and run from a terminal with something like `C:\mongodb\bin\mongod.exe --dbpath C:\mongodb\data --rest`


### For Windows development with Visual Studio

 * Visual Studio 2013
 * Node.js Tools for Visual Studio: https://nodejstools.codeplex.com/

## Running

#### (First time)

This will install all required Node modules.

    npm install

#### From CLI

    grunt
    node server.js

#### With grunt watch and [node-supervisor](https://github.com/isaacs/node-supervisor)

Tab A:

    grunt default watch

Tab B:

    supervisor server.js

#### Debugging with [node-inspector](https://github.com/node-inspector/node-inspector)

    grunt
    node-debug server.js

#### Running (and debugging) with Visual Studio 2013

Run Grunt tasks.

Press F5. :-)
