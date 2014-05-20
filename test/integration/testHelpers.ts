import authMiddleware = require('../../src/auth/middleware');

var mockUser = {
  username: 'Someone',
  name: 'Some One',
  email: 'someone@example.com'
};

export function mockAuthentication() {
  authMiddleware.requireAuthCookieOrRedirect = function (req, res, next) { 
    req.authSession.profile = mockUser;
    next(); 
  };
  authMiddleware.requireAuthOrDeny = function (req, res, next) { 
    req.authSession.profile = mockUser;
    next(); 
  };
}

