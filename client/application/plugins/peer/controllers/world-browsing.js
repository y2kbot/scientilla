/*
 * Scientilla v1.0 Beta (http://www.scientilla.net)
 * Copyright 2014-2015 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */

angular.module("peer").controller(
    "worldPeersBrowsingController", ["$scope", "peersService", "seedPeerReferencesService", "systemStatusService", "$window", "$location", function($scope, peersService, seedPeerReferencesService, systemStatusService, $window, $location) {
        $scope.changingSharedPeerId = "";
        $scope.changingAggregatedPeerId = "";
        $scope.keywords = "";        
        $scope.aPeers = [];
        $scope.aSeedPeers = [];
        $scope.aReferences = [];        
        $scope.startPageNumber = 1;
        $scope.numberOfItemsPerPage = 20;
        $scope.totalNumberOfItems = 10000;               
        $scope.keywords = "";
        $scope.currentPageNumber = 1;
            
        $scope.generatePeerIdsSharingMap = function(aPeers) {
            var peerIdsSharingMap = {};
            for (var lpKey in aPeers) {
                peerIdsSharingMap[aPeers[lpKey]._id] = aPeers[lpKey].sharing_status;
            }
            return peerIdsSharingMap;
        }
        
        $scope.generatePeerIdsAggregatingMap = function(aPeers) {
            var peerIdsAggregatingMap = {};
            for (var lpKey in aPeers) {
                peerIdsAggregatingMap[aPeers[lpKey]._id] = aPeers[lpKey].aggregating_status;
            }
            return peerIdsAggregatingMap;
        }        
        
        $scope.switchPeerSharingStatus = function(id) {
            $scope.changingSharedPeerId = id;
            if (!$scope.peerIdsSharingMap[id]) {
                peersService.setPeerAsShared(
                    id,
                    $window.sessionStorage.userToken
                ).success(function(data, status, headers, config) {
                    $scope.peerIdsSharingMap[id] = true;
                    $scope.changingSharedPeerId = ""; 
                }).error(function(data, status, headers, config) {
                    $scope.changingSharedPeerId = "";
                    systemStatusService.react(status);
                });
            } else {
                peersService.setPeerAsNotShared(
                    id,
                    $window.sessionStorage.userToken
                ).success(function(data, status, headers, config) {
                    $scope.peerIdsSharingMap[id] = false;
                    $scope.changingSharedPeerId = ""; 
                }).error(function(data, status, headers, config) {
                    $scope.changingSharedPeerId = "";
                    systemStatusService.react(status);
                });
            }
        }
        
        $scope.switchPeerAggregatingStatus = function(id) {
            $scope.changingAggregatedPeerId = id;
            if (!$scope.peerIdsAggregatingMap[id]) {
                peersService.setPeerAsAggregated(
                    id,
                    $window.sessionStorage.userToken
                ).success(function(data, status, headers, config) {
                    $scope.peerIdsAggregatingMap[id] = true;
                    $scope.changingAggregatedPeerId = ""; 
                }).error(function(data, status, headers, config) {
                    $scope.changingAggregatedPeerId = "";
                    systemStatusService.react(status);
                });
            } else {
                peersService.setPeerAsNotAggregated(
                    id,
                    $window.sessionStorage.userToken
                ).success(function(data, status, headers, config) {
                    $scope.peerIdsAggregatingMap[id] = false;
                    $scope.changingAggregatedPeerId = ""; 
                }).error(function(data, status, headers, config) {
                    $scope.changingAggregatedPeerId = "";
                    systemStatusService.react(status);
                });
            }
        }        
        
        $scope.retrievePeers = function retrievePeers() {        
            $scope.ready = false;
            $scope.error = false;
            var config = {
                keywords: $scope.keywords,
                page: $scope.currentPageNumber,
                rows: $scope.numberOfItemsPerPage,
            };
            async.series([
                function(callback) {
                    peersService.getPeers($window.sessionStorage.userToken, config)
                        .success(function(data, status, headers, config) {
                            $scope.aPeers = data.items;
                            
                            $scope.totalNumberOfItems = data.total_number_of_items;
                            $scope.lastPageNumber = Math.ceil($scope.totalNumberOfItems / $scope.numberOfItemsPerPage);             
                            
                            callback();
                        })
                        .error(function(data, status, headers, config) {
                            $scope.error = true;
                            systemStatusService.react(status, callback);
                        });
                },
                function(callback) {
                    $scope.peerIdsSharingMap = $scope.generatePeerIdsSharingMap($scope.aPeers);
                    callback();
                },
                function(callback) {
                    $scope.peerIdsAggregatingMap = $scope.generatePeerIdsAggregatingMap($scope.aPeers);
                    callback();
                },                
                function(callback) {
                    $scope.ready = true;
                    callback();
                }
            ]);
            
            return retrievePeers;
        }();
        
        $scope.retrieveSeedPeers = function retrieveSeedPeers() {        
            async.series([
                function(callback) {
                    peersService.getSeedPeers($window.sessionStorage.userToken).success(function(data, status, headers, config) {
                        $scope.aSeedPeers = data; 
                        callback();
                    }).error(function(data, status, headers, config) {
                        $scope.error = true;
                        systemStatusService.react(status, callback);
                    });
                }
            ]);
            
            return retrieveSeedPeers;
        }();
        
        $scope.retrieveSeedPeersReferences = function() {
            $scope.empty = false;
            $scope.ready = false;
            $scope.error = false;
            for (var seedPeerIndex = 0; seedPeerIndex < $scope.aSeedPeers.length; seedPeerIndex++) {
                async.series([
                    function(callback) {
                        seedPeerReferencesService.getReferences(
                            seedPeerIndex,
                            $scope.keywords,
                            $window.sessionStorage.userToken
                        ).success(function(data, status, headers, config) {
                            $scope.aReferences = data;
                            if ($scope.aReferences.length === 0) {
                                $scope.empty = true;
                            }                    
                            callback();
                        }).error(function(data, status, headers, config) {
                            $scope.error = true;
                            systemStatusService.react(status, callback);
                        });
                    },
                    function(callback) {
                        $scope.ready = true;
                        callback();
                    }
                ]);
            }
        };        
        
        $scope.retrievePreviousItemsPage = function() {
            if ($scope.startPageNumber > 1) {
                $scope.startPageNumber--;
            }            
            if ($scope.currentPageNumber > 1) {
                $scope.currentPageNumber--;
            }
            $scope.retrievePeers();
        };
        
        $scope.retrieveCustomItemsPage = function(customPageNumber) {            
            if (customPageNumber >= 1 && customPageNumber <= Math.ceil($scope.totalNumberOfItems / $scope.numberOfItemsPerPage)) {
                $scope.currentPageNumber = customPageNumber;
            }
            $scope.retrievePeers();
        };         
        
        $scope.retrieveNextItemsPage = function() {
            var numberOfPages = Math.ceil($scope.totalNumberOfItems / $scope.numberOfItemsPerPage);
            if ($scope.startPageNumber < (numberOfPages - 2)) {
                $scope.startPageNumber++;
            }
            if ($scope.currentPageNumber < numberOfPages) {
                $scope.currentPageNumber++; 
            }
            $scope.retrievePeers();
        }; 
    }]
);