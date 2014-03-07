/// <reference path="../../.types/jquery/jquery.d.ts" />
var $ = require('jquery');

(function (HttpVerb) {
    HttpVerb[HttpVerb["GET"] = 0] = "GET";
    HttpVerb[HttpVerb["POST"] = 1] = "POST";
})(exports.HttpVerb || (exports.HttpVerb = {}));
var HttpVerb = exports.HttpVerb;

var ApiClient = (function () {
    function ApiClient() {
    }
    ApiClient.prototype.sendRequest = function (request, callback) {
        $.ajax({
            accepts: 'application/json',
            contentType: 'application/json',
            timeout: 60 * 1000,
            url: buildUrl(request.path),
            type: request.verb.toString(),
            data: request.data,
            success: function (data, textStatus, jqXHR) {
                tryParseJSON(data, function (obj, success) {
                    if (success) {
                        callback({
                            status: jqXHR.status,
                            data: data
                        });
                    } else {
                        callback({
                            status: -1,
                            data: data
                        });
                    }
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
