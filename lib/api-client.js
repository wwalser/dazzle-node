var util = require('./util');
var conf = require('../config.json');

var ApiClient = function () {
    var ApiClient = $ = function (apiKey) {
        this.callbacks = [];
        this.lastCallTime = null;
        this.params = {};
        this.transientParams = {};
        this.params.key = apiKey || null;
        this.params.language = conf.language;
        this.params.version = conf.steamApiVersion;

        this.interface = null;
        this.method = null;

        return this;
    };

    $.fn = $.prototype = {};

    $.fn.extend = function (name, body) {
        if (typeof this[name] !== 'undefined') {
            console.error('Dazzle - ApiClient: ', name, ' already exists');
        }
        this[name] = function (params, next) {
            return body.call(this, params, next);
        };
    };

    $.fn.get = function (keys) {
        return this.params[keys];
    };

    $.fn.invoke = function (method) {
        this.method = method;
        return this;
    };

    $.fn.using = function (params) {
        this.transientParams = params;
        return this;
    };

    $.fn.on = function (iface) {
        this.interface = iface;
        this.lastCallTime = new Date().getTime();

        return util.makeCall(this);
    };

    $.fn.parseCallback = function () {
        var args = Array.prototype.slice.call(arguments);

        this.callbacks[args.shift()].apply(this, args);
        delete this.callbacks[args[0]];

        return this;
    };

    $.fn.then = function (callback) {
        var callbackId = util.generateCallbackId(this.interface, this.method);

        this.callbacks[callbackId] = callback;
        return this;
    };

    $.fn.set = function (key, value, overwrite) {
        var existingKey = typeof this.get(key);
        if (overwrite) {
            this.params[key] = value;
        } else if (existingKey === 'undefined') {
            this.params[key] = value;
        }
        return this;
    };

    $.fn.setApiKey = function (apiKey) {
        this.set('key', apiKey, true);
        return this;
    };

    return ApiClient;
};

module.exports = ApiClient;
