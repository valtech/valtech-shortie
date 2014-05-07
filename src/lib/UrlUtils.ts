var uriParser = require('uri-js');

export function parseAndClean(url: string): string {
  var uri = uriParser.parse(url);

  if (!uri.scheme) {
    uri = uriParser.parse('http://' + url);
  }

  if (!uri.path) {
    uri.path = '/';
  }

  return uriParser.serialize(uri);
}

export function getRootUrl(): string {
  return 'http://' + window.location.host + '/';
}