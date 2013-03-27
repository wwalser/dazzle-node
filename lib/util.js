var request = require('request');
var config = require('../config.json');
var querystring = require('querystring');

module.exports = exports = {
    generateUrl2: function (apiClientInstance) {
        var baseUrl = [config.steamApiProtocol, config.steamApiHost];

        var apiUrl = [
            '/', apiClientInstance.Interface,
            '/', apiClientInstance.method,
            '/v', config.steamApiVersion
        ];

        return baseUrl.concat(apiUrl).join("");
    },
    extend: function (dest, source) {
        for (var o in source) {
            if (source.hasOwnProperty(o)) {
                dest[o] = source[o];
            }
        };
        return dest;
    },
    makeCall: function (apiClientInstance) {
        var self = this;

        var params = self.extend({}, apiClientInstance.params);
        params = self.extend(params, apiClientInstance.transientParams);

        apiClientInstance.transientParams = {};

        self.makeRequest(self.generateUrl2(apiClientInstance), params, function (err, response, body) {
            var cbid = apiClientInstance.Interface + apiClientInstance.method;
            apiClientInstance.parseCallback(cbid, err, body.result, response);
        });

        return apiClientInstance;
    },
    makeRequest: function (url, query, next) {
        request.get({
            url: url,
            qs: query,
            json: true
        }, function (err, response, body) {
            next(err, response, body);
        });
    }
};
