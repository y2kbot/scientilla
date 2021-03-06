/*
 * Scientilla v1.0 Beta (http://www.scientilla.net)
 * Copyright 2014-2015 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */

angular.module("reference").controller(
    "referenceDeletionController", ["$scope", "$routeParams", "referencesService", "systemStatusService", "$window", "$location", function($scope, $routeParams, referencesService, systemStatusService, $window, $location) {
        $scope.deleteReference = function() {
            referencesService.deleteReference(              
                $routeParams.id, 
                $window.sessionStorage.userToken).success(function(data, status, headers, config) {
                    $location.path("browse-references");
                }).error(function(data, status, headers, config) {
                    systemStatusService.react(status);
                });
        };
    }]
);