/*
 * Scientilla v0.0.1 (http://www.scientilla.net)
 * Copyright 2014 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */


// Resolves dependencies
var _ = require("lodash");
var async = require("async");
var path = require("path");

var configurationManager = require(path.resolve(__dirname + "/../../system/controllers/configuration.js"));

var networkModel = require("../../network/models/default.js")();
var peerManager = require("../../peer/models/default.js")();
var collectedReferencesManager = require("../../reference/models/collected-references.js")();
var referencesManager = require("../../reference/models/default.js")();

module.exports = function () {
        var getReferencesFromAliases = function(rankedReferencesCollection, aliases, config, cb) {
            if (!aliases) {
                cb(new Error("no aliases"), null);
            }
            var aliasesQuery = aliases.join("|");
            var keywords = config.keywords || "";
            var page = config.page || 1;
            var rows = config.rows || 20;
            var skip = (page - 1) * rows;
            var keywordsQuery = "^(?=.*(" + keywords.replace(" ", "))(?=.*(") + "))";
            
            rankedReferencesCollection.find({
                $and: [
                    {"value.top.authors": { 
                        $regex: aliasesQuery,
                        $options: 'i'
                    }},
                    {"value.top.title": {
                        $regex: keywordsQuery,
                        $options: 'i'
                    }}
                ]
            })
                    .sort({ 
                    "value.top.creation_datetime": -1
                }
            ).skip(
                skip
            ).limit(
                rows
            ).toArray(function(err, references) {
                if (err) {
                    cb(err, null);
                }
                var normalizedReferences = collectedReferencesManager.normalizeRankedReferences(references);
                cb(null, normalizedReferences);
            });
        };
    return {
        getReferences: function(req, res) {
            var configuration = configurationManager.get();
            if (configuration.seed) {
                var aliases = req.query.aliases;                
                var config = _.pick(req.query, ['keywords', 'page', 'rows']);
                getReferencesFromAliases(
                    req.rankedReferencesCollection, 
                    aliases, 
                    config, 
                    function(err, references) {
                        if (err) {
                            console.log(err);
                            res.status(500).end();
                            return;
                        }
                        res.setHeader("Content-Type", "application/json");
                        res.json(references);
                        return;
                    });
            } else {
                networkModel.getRandomSeed(req.seedsConfiguration, function(err, seed) {
                    var url = seed.url + "/api/discovery/references";
                    req.request({ 
                        url: url, 
                        qs: req.query,
                        strictSSL: false,
                        json: true
                    }, function(err, response, body) {
                            if (err) {
                                console.log(err);
                                res.status(500).end();
                                return;
                            }
                            res.setHeader("Content-Type", "application/json");
                            res.json(body);
                            return;
                        });
                    });
            }
        },
        getFilteredReferences: function(req, res) {
            var configuration = configurationManager.get();
            var peer;
            async.waterfall([
                function(cb) {
                    if (configuration.seed) {
                        peer = configuration.url;
                        cb(null, peer);
                    } else {
                        networkModel.getRandomSeed(
                            req.seedsConfiguration, 
                            function(err, seed) {
                                if (err) {
                                    cb(err, null);
                                } else {
                                    cb(null, seed.url);
                                }
                            });
                    }
                },
                function(peer_url, cb) {
                    var url = peer_url + "/api/discovery/references";
                    req.request({ 
                        url: url, 
                        qs: req.query,
                        strictSSL: false,
                        json: true
                    }, function(err, response, body) {
                            if (err) {
                                cb(err, null);
                            }
                            cb(null, body);
                        });
                    }
            ],
            function(err, aliasesReferences) {
                referencesManager.getVerifiedReferences(
                    req.referencesCollection,
                    req.user.hashes,
                    aliasesReferences, 
                    null,
                    function(err, references) {
                        if (err) {
                            console.log(err);
                            res.status(500).end();
                            return;
                        }
                        res.setHeader("Content-Type", "application/json");
                        res.json(references);
                        return;
                    });
            });
        }
    };
};