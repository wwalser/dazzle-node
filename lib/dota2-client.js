var ApiClient = require('./api-client');
var Dota2Client = new ApiClient();

/**
 * Retrieves a list of all Dota 2 heroes
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

/**
 * Retrieves only itemized (aka has items in the store) heroes
 * @details http://wiki.teamfortress.com/wiki/WebAPI/GetHeroes
 */
Dota2Client.fn.getItemizedHeroes = function (next) {
    this.getHeroes({ 'itemizedonly' : 1 }, next);
};

/**
 * Retrieves a list of item rarity types, includes colors!
 * @details http://wiki.teamfortress.com/wiki/WebAPI/GetRarities
 */
Dota2Client.fn.getRarities = function (next) {
    this.invoke('GetRarities')
        .on('IEconDOTA2_570')
        .then(next);
};

/**
 * Retrieves a list of the most recent matches
 * @details http://wiki.teamfortress.com/wiki/WebAPI/GetMatchHistory
 */
Dota2Client.fn.getMatchHistory = function (params, next) {
    if (typeof params === 'function') {
        next = params;
        params = {};
    }

    this.invoke('GetMatchHistory')
        .using(params)
        .on('IDOTA2Match_570')
        .then(next);
};

Dota2Client.fn.getMatchHistoryByGameMode = function (game_mode, next) {
    this.getMatchHistory({ game_mode: game_mode }, next);
};

module.exports = exports = Dota2Client;
