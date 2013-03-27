var request = require('request');

var method = require('./data')['method'];
var iface = require('./data')['interface'];

var util = require('./util');
var conf = require('../config.json');

var apiClient = function (apiKey) {
    if (this.instance) {
        return this.instance;
    }

    this.instance = null;

    var ApiClient;

    (function (apiKey) {
        var $ = function(apiKey) {
            this.callbacks = [];
            this.lastCallTime = null;
            this.params = {};
            this.transientParams = {};
            this.params.key = apiKey;
            this.params.language = conf.locale;
            this.params.version = conf.steamApiVersion;

            this.Interface = null;
            this.method = null;

            return this;
        };

        $.fn = $.prototype = {};

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
            this.Interface = iface;
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
            this.callbacks[this.Interface + this.method] = callback;
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

        ApiClient = $;
    })(apiKey);

    this.instance = instance = new ApiClient(apiKey);

    /**********************************
     * Public facing methods
     **********************************/

    /**
     * Retrieves a json representation of Dota 2 heroes.
     * @details http://wiki.teamfortress.com/wiki/WebAPI/GetHeroes
     */
    instance.getHeroes = function (params, next) {
        if (typeof params === 'function') {
            next = params;
            params = {};
        }

        instance.invoke(method.get_heroes)
                .using(params)
                .on(iface.IEconDOTA2_570)
                .then(next);
    };

    instance.getItemizedHeroes = function (next) {
        instance.getHeroes({ 'itemizedonly': 1 }, next);
    };

    instance.getMatchHistory = function (next) {
        instance.invoke(method.get_match_history)
                .on(iface.IDOTA2Match_570)
                .then(next);
    };

    instance.getRarities = function (next) {
        instance.invoke(method.get_rarities)
                .on(iface.IEconDOTA2_570)
                .then(next);
    };

    return this.instance;
};

module.exports = apiClient;