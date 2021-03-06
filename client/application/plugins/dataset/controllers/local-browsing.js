/*
 * Scientilla v1.0 Beta (http://www.scientilla.net)
 * Copyright 2014-2015 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */
         
angular.module("dataset").controller(
    "localDatasetsBrowsingController", ["$scope", "datasetsService", "peersService", "peerReferencesService", "datasetReferencesService", "systemStatusService", "$window", "$location", function($scope, datasetsService, peersService, peerReferencesService, datasetReferencesService, systemStatusService, $window, $location) {
        $scope.changingCollectedDatasetId = "";
        $scope.changingSharedDatasetId = "";
        $scope.aDatasets = [];
        $scope.startPageNumber = 1;
        $scope.currentPageNumber = 1;
        $scope.numberOfItemsPerPage = 25;
        $scope.totalNumberOfItems = 10000;        
        
        $scope.generateDatasetIdsSharingMap = function(aDatasets) {
            var datasetIdsSharingMap = {};
            for (lpKey in aDatasets) {
                datasetIdsSharingMap[aDatasets[lpKey]._id] = aDatasets[lpKey].sharing_status;
            }
            return datasetIdsSharingMap;
        }
        
        $scope.collect = function(id) {

        }
        
        $scope.switchDatasetSharingStatus = function(id) {
            $scope.changingSharedDatasetId = id;
            if (!$scope.datasetIdsSharingMap[id]) {
                datasetsService.setDatasetAsShared(
                    id,
                    $window.sessionStorage.userToken
                ).success(function(data, status, headers, config) {
                    $scope.datasetIdsSharingMap[id] = true;
                    $scope.changingSharedDatasetId = ""; 
                }).error(function(data, status, headers, config) {
                    $scope.changingSharedDatasetId = "";
                    systemStatusService.react(status);
                });
            } else {
                datasetsService.setDatasetAsNotShared(
                    id,
                    $window.sessionStorage.userToken
                ).success(function(data, status, headers, config) {
                    $scope.datasetIdsSharingMap[id] = false;
                    $scope.changingSharedDatasetId = ""; 
                }).error(function(data, status, headers, config) {
                    $scope.changingSharedDatasetId = "";
                    systemStatusService.react(status);
                });
            }
        }
        
        $scope.retrieveDatasets = function retrieveDatasets() {
            $scope.empty = false;
            $scope.ready = false;
            $scope.error = false;
            async.series([
                function(callback) {
                    datasetsService.getDatasets($window.sessionStorage.userToken).success(function(data, status, headers, config) {
                        $scope.aDatasets = data;
                        if ($scope.aDatasets.length === 0) {
                            $scope.empty = true;
                        }                    
                        callback();
                    }).error(function(data, status, headers, config) {
                        $scope.error = true;
                        systemStatusService.react(status, callback);
                    });
                },
                function(callback) {
                    $scope.datasetIdsSharingMap = $scope.generateDatasetIdsSharingMap($scope.aDatasets);
                    callback();
                },
                function(callback) {
                    $scope.ready = true;
                    callback();
                }
            ]);
            
            return retrieveDatasets;
        }();
        
        $scope.retrievePreviousItemsPage = function() {
            if ($scope.startPageNumber > 1) {
                $scope.startPageNumber--;
            }            
            if ($scope.currentPageNumber > 1) {
                $scope.currentPageNumber--;
            }
        };
        
        $scope.retrieveCustomItemsPage = function(customPageNumber) {            
            if (customPageNumber >= 1 && customPageNumber <= Math.ceil($scope.totalNumberOfItems / $scope.numberOfItemsPerPage)) {
                $scope.currentPageNumber = customPageNumber;
            }
        };         
        
        $scope.retrieveNextItemsPage = function() {
            if ($scope.startPageNumber < (Math.ceil($scope.totalNumberOfItems / $scope.numberOfItemsPerPage) - 2)) {
                $scope.startPageNumber++;
            }
            if ($scope.currentPageNumber < Math.ceil($scope.totalNumberOfItems / $scope.numberOfItemsPerPage)) {
                $scope.currentPageNumber++; 
            }
        };        
    }]
);