# Valtech Shortie - valte.ch

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

Go to `/admin` and login using Valtech IDP. You can administer existing URLs and add new ones.


# API

TODO. Will require an "application key + secret". POST, PUT and DELETE. JSON data.


# Deployment

Valtech Shortie is deployed with our internal TeamCity instance:
http://bob.valtech.se.

 * Branch `master` is automatically deployed to production.
 * Branch `develop` is automatically deployed to stage.

If TeamCity does not trigger a build for a branch (e.g. after merge to `master`), trigger one yourself (by pressing the ... next to "Run" and then choosing branch).

The application is deployed to Azure.

The MongoDB databases are located at [MongoHQ](https://app.mongohq.com/). Ask IT for access.


# Dev

## Creating a local environment with Vagrant

This project is setup with Vagrant, to make it easy to get up and running. To create a VM with a local development
environment using Vagrant, you need the following software installed on your host machine:

 * Vagrant (http://vagrantup.com)
 * VirtualBox (https://www.virtualbox.org/)
 * nfsd - see https://docs.vagrantup.com/v2/synced-folders/nfs.html
   * sudo apt-get install nfs-kernel-server # Ubuntu 14.04

Create, provision and bootstrap the Vagrant box like this:

    vagrant up
    vagrant ssh

You are now inside a VM setup for development, and can skip the manual install steps.

## Manual install

### For all platforms

 * Node.js: http://nodejs.org/ (use official installer)
 * Grunt: `npm install -g grunt grunt-cli`
 * MongoDB
   * Mac OS X: `brew install mongodb` and run it with `mongod`
   * Windows: Download, unzip somewhere (e.g. `C:\mongodb`), and run from a terminal with something like `C:\mongodb\bin\mongod.exe --dbpath C:\mongodb\data --rest`


### For Windows development with Visual Studio

 * Visual Studio 2013
 * Node.js Tools for Visual Studio: https://nodejstools.codeplex.com/

## Authentication

By default Valtech Shortie will not require any authentication, and `/admin` will be accessible for all.
To enable authentication through Valtech IDP, set the environment variables:

```
AUTH_MODE=idp
IDP_CLIENT_ID=valtech.shortie.local
IDP_CLIENT_SECRET=<FETCH FROM IDP STAGE ADMIN>
```

You can do this by creating adding the above lines to a file `.env` in the root folder.

## Running

### First time

*Done automatically as part of the Vagrant bootstrap process.*

This will install all required Node modules.

    npm install

### From CLI

    grunt
    node server.js

### With grunt watch and [node-supervisor](https://github.com/isaacs/node-supervisor)

Tab A:

    grunt default watch

Tab B:

    supervisor server.js

### Debugging with [node-inspector](https://github.com/node-inspector/node-inspector)

    grunt
    node-debug server.js

### Running (and debugging) with Visual Studio 2013

Run Grunt tasks.

Press F5. :-)
