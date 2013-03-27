var ApiClient = require('./api-client');
var Dota2Client = new ApiClient();

/**
 * Retrieves a json representation of Dota 2 heroes.
 * @details http://wiki.teamfortress.com/wiki/WebAPI/GetHeroes
 */
Dota2Client.fn.getHeroes = function (params, next) {
    if (typeof params === 'function') {
        next = params;
        params = {};
    }

    this.invoke('GetHeroes')
        .using(params)
        .on('IEconDOTA2_570')
        .then(next);
};

Dota2Client.fn.getItemizedHeroes = function (next) {
    this.getHeroes({ 'itemizedonly' : 1 }, next);
};

Dota2Client.fn.getRarities = function (next) {
    this.invoke('GetRarities')
        .on('IEconDOTA2_570')
        .then(next);
};

Dota2Client.fn.getMatchHistory = function (next) {
    this.invoke('GetMatchHistory')
        .on('IDOTA2Match_570')
        .then(next);
};

module.exports = exports = Dota2Client;
