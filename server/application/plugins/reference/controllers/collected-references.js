/*
 * Scientilla v0.0.1 (http://www.scientilla.net)
 * Copyright 2014 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */

// Resolves dependencies
var _ = require("lodash");

var model = require("../models/collected-references.js")();

// Defines actions
module.exports = function () {
    var retrieveReferences = function(referencesCollection, peers, keywords, currentPageNumber, numberOfItemsPerPage) {            
        var regexQuery = "^(?=.*(" + keywords.replace(" ", "))(?=.*(") + "))";
        peers.push("");
        return referencesCollection.find({                
            "$and": [
                {
                    peer_url: {
                        $in: peers
                    }
                },
                {
                    "$or": [
                        {
                            title: { 
                                $regex: regexQuery,
                                $options: 'i'
                            }
                        },
                        {
                            authors: { 
                                $regex: regexQuery,
                                $options: 'i'
                            }
                        }
                    ]
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
    
    return {        
        rankReferences: function(collectedReferencesCollection) {
            var x = collectedReferencesCollection.mapReduce(
                function() { emit(this.original_hash, this); },
                function(original_hash, references) {
                    return references;
                },
                {
                    query: {original_hash: { $exists: true }},
                    out: { replace: 'ranked-references' },
                    finalize: function(original_hash, references) {
                        if (!_.isArray(references)) {
                            references = [references];
                        }
                        var groupedReferences = _.groupBy(references, 'clone_hash');
                        var bestReference = _.max(groupedReferences, 'length');
                        var others = _.map(groupedReferences, function(references, clone_hash) {
                            return {
                                clone_hash: clone_hash,
                                count: references.length
                            };
                        });
                        var result = {
                            top: bestReference,
                            others: others
                        };
                        return result;
                    }
                }
            );
        },
        getReferences: function(req, res) {
            var keywords = _.isUndefined(req.query.keywords) ? "" : req.query.keywords;
            var networkPeers = _.isUndefined(req.query.network_peers) ? [] : req.query.network_peers.split(",");
            var currentPageNumber = _.isUndefined(req.query.current_page_number) ? 1 : req.query.current_page_number;
            var numberOfItemsPerPage = _.isUndefined(req.query.number_of_items_per_page) ? 20 : req.query.number_of_items_per_page;            
            var retrievedCollection = retrieveReferences(req.collectedReferencesCollection, keywords, currentPageNumber, numberOfItemsPerPage);
            var result = {};
            retrievedCollection.count(function(err, referencesCount) {
                if (err || req.underscore.isNull(referencesCount)) {
                    res.status(404).end();
                    return;
                }
                result.total_number_of_items = referencesCount;
                retrievedCollection.toArray(function(err, references) {
                    if (err || req.underscore.isNull(references)) {
                        res.status(404).end();
                        return;
                    }
                    result.items = references;
                    res.setHeader("Content-Type", "application/json");
                    res.json(result);                
                });                
            });            
        }
    };
};
