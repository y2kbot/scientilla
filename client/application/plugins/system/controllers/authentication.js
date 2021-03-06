/*
 * Scientilla v1.0 Beta (http://www.scientilla.net)
 * Copyright 2014-2015 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */

angular.module("system").controller(
    "systemAuthenticationController", 
    ["$scope", "usersService", "settingsService", "systemStatusService", "$window", "$location", 
    function($scope, usersService, settingsService, systemStatusService, $window, $location) {
        $scope.oUser = {
            username: "", 
            password: ""
        };
        
        $scope.login = function() {
            usersService.loginUser({
                username: $scope.oUser.username,
                password: $scope.oUser.password
            }).success(function(data, status, headers, config) {
                usersService.updateExchangedInformation(data, function() {
                    settingsService.updateExchangedInformation(data, function() {
                        $scope.$emit("successful-login");                        
                        $scope.$emit("exchanged-information-modification");
                        $location.path("browse-references");
                    });
                });
            }).error(function(data, status, headers, config) {
                usersService.deleteExchangedInformation(function() {
                    settingsService.deleteExchangedInformation(function() {
                        systemStatusService.react(status);
                    });
                });
            });
        };
        
        $scope.start = $scope.login;
        
        $scope.logout = function() {
            usersService.deleteExchangedInformation(function() {
                settingsService.deleteExchangedInformation(function() {
                    $scope.$emit("successful-logout");
                    // $window.location.href = "/";
                    $location.path("login");
                });
            });
        };
        
        $scope.init = function(page) {
            systemStatusService.getStatus()
                .success(function(data, status, headers, config) {
                    if (data["users-count"] === 0 && page === 'login') {
                        $location.path("start");
                   }
                    if (data["users-count"] !== 0 && page === 'start') {
                        $location.path("login");
                   }
               })
               .error(function(data, status, headers, config) {
               });
        };
        
    }]
);