var uriParser = require('uri-js');


export function parseAndClean(url: string): string {
  var parserResult = uriParser.parse(url);

  if (!parserResult.scheme)
    return 'http://' + url;

  return url;
}
