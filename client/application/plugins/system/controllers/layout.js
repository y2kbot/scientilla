/*
 * Scientilla v0.0.1 (http://www.scientilla.net)
 * Copyright 2014 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */

angular.module("system").controller(
    "systemLayoutController", ["$scope", "$window", "$location", function($scope, $window, $location) {
        $scope.bSidebarVisualizationStatus = $window.sessionStorage.hasOwnProperty("sidebarVisualizationStatus") ? $window.sessionStorage.sidebarVisualizationStatus : "closed";
        $window.sessionStorage.sidebarVisualizationStatus = $scope.bSidebarVisualizationStatus;
        $scope.userScientillaNominative = "SCIENTILLA";
        $scope.bCollectedPublicationsMenuVisualizationStatus = false;
        
        $scope.updateSidebarStatus = function updateSidebarStatus() {          
            /* TO-DO: substitute the jQuery code with a directive. */
            /* jQuery code start */
            if ($scope.bSidebarVisualizationStatus === "opened") {
                $("#toolbar-and-content-container").stop(true).animate({"left": "270px", "border-width": "0px 0px 0px 1px"});
                $("#sidebar-container").stop(true).animate({"left": "0px"});                
            } else {
                $("#sidebar-container").stop(true).animate({"left": "-270px"});
                $("#toolbar-and-content-container").stop(true).animate({"left": "0px", "border-width": "0px 0px 0px 1px"});
            }
            /* jQuery code end */
            
            return updateSidebarStatus;
        }();        
        
        $scope.toggleSidebar = function() {
            if ($scope.bSidebarVisualizationStatus === "opened") {
                $scope.bSidebarVisualizationStatus = "closed";
            } else {
                $scope.bSidebarVisualizationStatus = "opened";
            }
            $window.sessionStorage.sidebarVisualizationStatus = $scope.bSidebarVisualizationStatus;
            
            $scope.updateSidebarStatus();
        };
        
        $scope.updateControllerStatus = function updateControllerStatus() {
            $scope.userScientillaNominative = $window.sessionStorage.userScientillaNominative;
            $scope.bCollectedPublicationsMenuVisualizationStatus = $window.sessionStorage.peerMode;
            
            return updateControllerStatus;
        }();

        $scope.$on("successful-login", $scope.toggleSidebar);
        
        $scope.$on("exchanged-information-modification", $scope.updateControllerStatus);
    }]
);