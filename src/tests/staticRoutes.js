var request = require('supertest'),
    express = require('express');

var app = require('../app').app;

describe('GET /', function() {
  it('should return html', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });
});
