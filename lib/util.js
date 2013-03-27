var request = require('request');
var config = require('../config.json');
var querystring = require('querystring');

module.exports = exports = {
    generateUrl2: function (apiClient) {
        var baseUrl = [config.steamApiProtocol, config.steamApiHost];

        var apiUrl = [
            '/', apiClient.interface,
            '/', apiClient.method,
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
    generateCallbackId: function (iface, method) {
        return iface + '_' + method;
    },
    makeCall: function (apiClient) {
        var self = this;

        var url = self.generateUrl2(apiClient);
        var params = self.extend({}, apiClient.params);

        params = self.extend(params, apiClient.transientParams);

        self.makeRequest(url, params, function (err, response, body) {
            var callbackId = self.generateCallbackId(apiClient.interface, apiClient.method);
            apiClient.parseCallback(callbackId, err, body.result, response);
        });

        apiClient.transientParams = {};

        return apiClient;
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
