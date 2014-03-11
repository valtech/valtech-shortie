var uriParser = require('uri-js');

function parseAndClean(url) {
    var parserResult = uriParser.parse(url);

    if (!parserResult.scheme)
        return 'http://' + url;

    return url;
}
exports.parseAndClean = parseAndClean;
