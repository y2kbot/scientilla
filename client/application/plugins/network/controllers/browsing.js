/*
 * Scientilla v1.0 Beta (http://www.scientilla.net)
 * Copyright 2014-2015 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */

angular.module("network").controller(
    "networkReferencesBrowsingController", 
    ["$scope", "networkReferencesService", "systemStatusService", "$window", "$location", "notificationService", "referencesService",
    function($scope, networkReferencesService, systemStatusService, $window, $location, notificationService, referencesService) {
        $scope.keywords = "";
        $scope.aReferences = [];
        $scope.startPageNumber = 1;
        $scope.currentPageNumber = 1;
        $scope.lastPageNumber = 0;
        $scope.numberOfItemsPerPage = 20;
        $scope.totalNumberOfItems = 0;   
        
        $scope.getPeerPath = function(peerId, peerUrl) {
            if (peerUrl === $window.sessionStorage.url) {
                return '#/';
            }
            return '#/browse-peer-references/' + peerId + '/';
        };
        
        $scope.getReferencePath = function(referenceId, peerId, peerUrl) {
            if (peerUrl === $window.sessionStorage.url) {
                return '/open-reference/' + referenceId;
            }
            return '/open-peer-reference/' + peerId + '/' + referenceId;
        };
        
        $scope.openReference = function(referenceId, peerId, peerUrl) {
            $window.sessionStorage.referenceOpeningCallOrigin = "network-listing";
            $location.path($scope.getReferencePath(referenceId, peerId, peerUrl));
        };
        
        $scope.cloneReference = function(reference) {
            referencesService.cloneReferenceFromPeer(
                reference.peer_id, 
                reference.original_id,
                $window.sessionStorage.userToken, 
                function(result) {
                    switch(result.status) {
                        case 200: 
                            notificationService.info('Reference cloned');
                            reference.clonable = false;
                            reference.selected = false;
                            break;
                        case 409:
                            notificationService.warning('Element already cloned');
                            break;
                        case 404:
                        case 500:
                            systemStatusService.react(result.status);
                            notificationService.error('An error happened');
                            break;
                        default:
                            systemStatusService.react(result.status);
                            notificationService.error('An error happened');
                    }
                }
            );
        };

        $scope.cloneSelectedReferences = function(){
            var selectedReferences = _.filter($scope.aReferences, {selected: true});

            var cloneReferences = 
                _.map(selectedReferences, function(reference) {
                   return function(callback) {
                       referencesService.cloneReferenceFromPeer(
                            reference.peer_id, 
                            reference.original_id,
                            $window.sessionStorage.userToken,
                            function(result) {
                               var data = {
                                   reference: reference,
                                   result: result
                               };
                               callback(null, data);
                            }
                       );
                   };
                });

            var notifyResults = function(err, allData){
                if (err) {
                    notificationService.info('Some error happened');
                    return;
                }
                var clonedReferences = 0;
                var duplicatedReferences = 0;
                var errors = 0;
                allData.forEach(function(data) {
                    var result = data.result;
                    var reference = data.reference;
                    switch(result.status) {
                        case 200: 
                            reference.clonable = false;
                            reference.selected = false;
                            clonedReferences++;
                            break;
                        case 409:
                            duplicatedReferences++;
                            break;
                        case 404:
                        case 500:
                            systemStatusService.react(result.status);
                            errors++;
                            break;
                        default:
                            systemStatusService.react(result.status);
                            errors++;
                    }
                });
                var msg = "";
                if (allData.length === 0) {
                    msg = 'No References Selected';
                } else {
                    if (clonedReferences > 0) {
                        if (clonedReferences === 1) {
                            msg += clonedReferences + ' Reference Cloned.\n';
                        } else {
                            msg += clonedReferences + ' References Cloned.\n';
                        }
                    }
                    if (duplicatedReferences > 0 ) {
                        if (duplicatedReferences === 1) {
                            msg += duplicatedReferences + ' Reference is not clonable.\n';
                        } else {
                            msg += duplicatedReferences + ' References are not clonable.\n';
                        }
                    }
                    if (errors > 0 ) {
                        msg += 'Some error happened.\n';
                    }
                }
                notificationService.info(msg);
            };
            async.parallel(cloneReferences, notifyResults);
        };  
        
        $scope.retrieveReferences = function retrieveReferences() {
            $scope.empty = false;
            $scope.ready = false;
            $scope.error = false;
            async.series([
                function(callback) {
                    networkReferencesService.getReferences(
                        $scope.keywords,
                        $scope.currentPageNumber,
                        $scope.numberOfItemsPerPage,
                        $window.sessionStorage.userToken
                    ).success(function(data, status, headers, config) {
                        $scope.totalNumberOfItems = data.total_number_of_items;
                        $scope.aReferences = data.items;
                        _.forEach($scope.aReferences, function(r) {r.reliabilityLoading = 0;});
                        $scope.lastPageNumber = Math.ceil($scope.totalNumberOfItems / $scope.numberOfItemsPerPage);
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
                    var referenceOriginalHashes = _.pluck($scope.aReferences, 'original_hash');
                    networkReferencesService.getReferencesDetail(
                        referenceOriginalHashes, 
                        $window.sessionStorage.userToken
                    ).success(function(data, status, headers, config) {
                        _.forEach($scope.aReferences, function(r) {
                            var r2 = _.find(data.items, function(ref) {return ref.original_hash === r.original_hash;});
                            if (_.isUndefined(r2)) {
                                r.reliabilityLoading = 1;
                            }
                            else {
                                r.reliabilityLoading = 2;
                                r.reliability = r2.confirmedBy + '/' + r2.clonesNum;
                            }
                        });
                        callback();                        
                    }).error(function(data, status, headers, config) {
                        $scope.error = true;
                        systemStatusService.react(status, callback);
                    });
                    
                }
            ],  function(err) {
                });
            
            return retrieveReferences;
        }();
        
        $scope.retrievePreviousItemsPage = function() {
            if ($scope.startPageNumber > 1) {
                $scope.startPageNumber--;
            }            
            if ($scope.currentPageNumber > 1) {
                $scope.currentPageNumber--;
            }
            $scope.retrieveReferences();
        };
        
        $scope.retrieveCustomItemsPage = function(customPageNumber) {            
            if (customPageNumber >= 1 && customPageNumber <= Math.ceil($scope.totalNumberOfItems / $scope.numberOfItemsPerPage)) {
                $scope.currentPageNumber = customPageNumber;
            }
            $scope.retrieveReferences();
        };         
        
        $scope.retrieveNextItemsPage = function() {
            if ($scope.startPageNumber < (Math.ceil($scope.totalNumberOfItems / $scope.numberOfItemsPerPage) - 2)) {
                $scope.startPageNumber++;
            }
            if ($scope.currentPageNumber < Math.ceil($scope.totalNumberOfItems / $scope.numberOfItemsPerPage)) {
                $scope.currentPageNumber++; 
            }
            $scope.retrieveReferences();
        };       
    }]        
);