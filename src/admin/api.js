var $ = require('jquery');

var ApiClient = (function () {
    function ApiClient() {
    }
    ApiClient.prototype.sendRequest = function (request, callback) {
        $.ajax({
            accepts: 'application/json',
            contentType: 'application/json',
            timeout: 60 * 1000,
            url: buildUrl(request.path),
            type: request.verb,
            data: JSON.stringify(request.data),
            success: function (data, textStatus, jqXHR) {
                callback({
                    status: jqXHR.status,
                    data: data
                });
            },
            error: function (jqXHR, textStatus, errorThrow) {
                callback({
                    status: jqXHR.status,
                    data: jqXHR.response
                });
            }
        });
    };
    return ApiClient;
})();
exports.ApiClient = ApiClient;

function tryParseJSON(data, callback) {
    try  {
        var obj = JSON.parse(data);
        callback(obj, true);
    } catch (e) {
        callback(null, false);
    }
}

function buildUrl(path) {
    return '/shorties' + path;
}
