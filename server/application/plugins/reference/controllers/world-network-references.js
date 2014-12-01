/*
 * Scientilla v0.0.1 (http://www.scientilla.net)
 * Copyright 2014 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */

var async = require("async");
var request = require("request");
var _ = require("lodash");

var referenceManager = require("../../reference/models/default.js")();
var networkModel = require("../../network/models/default.js")();
var collectedReferencesManager = require("../../reference/models/collected-references.js")();
var configurationManager = require("../../system/controllers/configuration.js");
var referencesManager = require("../../reference/models/default.js")();

module.exports = function () {
    var objsArray2MongoSearchQuery = function(objsArray) {
        var searchCriteria = _.map(
            objsArray, 
            function(r){
                var propCriteria = _.mapValues(
                    r, 
                    function(val, key) {
                        var propCriterion = {};
                        propCriterion[key] = val;
                        return propCriterion;
                    });
                var searchCriterion =  {$and: propCriteria};
                return searchCriterion;
            });
        var searchQuery = {$or: searchCriteria};
        return searchQuery;
    };
    var retrieveReferences = function(rankedReferencesCollection, keywords, currentPageNumber, numberOfItemsPerPage) {            
        var regexQuery = "^(?=.*(" + keywords.replace(" ", "))(?=.*(") + "))";
        return rankedReferencesCollection.find({                
            "$or": [
                {
                    "value.top.title": { 
                        $regex: regexQuery,
                        $options: 'i'
                    }
                },
                {
                    "value.top.authors": { 
                        $regex: regexQuery,
                        $options: 'i'
                    }
                }
            ]
        }).sort(
            { 
                original_hash: 1,
                clone_hash: 1,                
                creation_datetime: -1 
            }
        ).skip(
            currentPageNumber > 0 ? ((currentPageNumber - 1) * numberOfItemsPerPage) : 0
        ).limit(
            numberOfItemsPerPage
        );
    };
    
    var resolveReferencePeers = function(references, peersCollection, finalizationCallback) {
        async.mapSeries(
            references,
            function(reference, iterationCallback) {
                peersCollection.find({ url: reference.peer_url }).toArray(function(error, peers) {
                    if (error || _.isNull(peers) || _.isUndefined(peers) || peers.length === 0) {
                        iterationCallback(error, reference);
                        return;
                    }
                    reference.peer_id = peers[0]._id;
                    iterationCallback(null, reference);
                });
            },
            function(error, resolvedReferences) {
                finalizationCallback(resolvedReferences);
            }
        );
    };
    
    return {        
        getReferences: function(req, res) {
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
                    var url = peer_url + "/api/ranked-references";
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
            function(err, referencesObj) {
                var result = _.pick(referencesObj, ['total_number_of_items']);
                referencesManager.getVerifiedReferences(
                    req.referencesCollection,
                    req.user.hashes,
                    referencesObj.items, 
                    null,
                    function(err, references) {
                        if (err) {
                            console.log(err);
                            res.status(500).end();
                            return;
                        }
                        result.items = references;
                        res.setHeader("Content-Type", "application/json");
                        res.json(result);
                        return;
                    });
            });
        },
        getRankedReference: function(req, res) {
            var id = req.params.id;
            var configuration = configurationManager.get();
            if (configuration.seed) {
                req.rankedReferencesCollection.findOne({_id: id}, function(err, rankedReference) {
                    if (err || req.underscore.isNull(rankedReference)) {
                        console.log(err);
                        res.status(404).end();
                        return;
                    }
                    var searchQuery = objsArray2MongoSearchQuery(rankedReference.value.all);
                    req.collectedReferencesCollection.find(searchQuery)
                        .toArray(function(err, references) {
                            if (err || req.underscore.isNull(references)) {
                                res.status(404).end();
                                return;
                            }
                            res.setHeader("Content-Type", "application/json");
                            res.status(200).send(references).end();
                        });            
                });                
            } else {
                networkModel.getRandomSeed(
                    req.seedsConfiguration, 
                    function(err, seed) {
                        if (err) {
                            console.log(err);
                            res.status(404).end();
                            return;
                        } else {
                            var url = seed.url + "/api/world-network-references/" + req.params.id + "/";
                            req.request({ 
                                url: url, 
                                strictSSL: false,
                                json: true
                            }, function(err, response, body) {
                                    if (err) {
                                        console.log(err);
                                        res.status(404).end();
                                        return;
                                    }
                                    res.setHeader("Content-Type", "application/json");
                                    res.status(200).json(body).end();
                                });
                        }
                    });
            }
        }
    };
};
