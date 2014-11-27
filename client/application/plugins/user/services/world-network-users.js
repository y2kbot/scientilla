/*
 * Scientilla v0.0.1 (http://www.scientilla.net)
 * Copyright 2014 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */

angular.module("user").factory(
    "worldNetworkUsersService", function($http) {
        var worldNetworkUsersProvider = {};
        
        worldNetworkUsersProvider.getUsers = function(keywords, currentPageNumber, numberOfItemsPerPage, token) {
            var params = {};
            if (keywords) {
                params.keywords = keywords;
            }
            if (currentPageNumber) {
                params.current_page_number = currentPageNumber;
            } 
            if (numberOfItemsPerPage) {
                params.number_of_items_per_page = numberOfItemsPerPage;
            }            
            return $http({
				method: "GET",
				url: "/api/world-network-users",
                params: params,
                cache: false,
                timeout: 30000,
                headers: {
                    Authorization: 'Bearer ' + token
                }
			});
        };        
        
        worldNetworkUsersProvider.getUser = function(userId, token) {
            return $http({
				method: "GET",
				url: "/api/world-network-users/" + userId,
                cache: false,
                timeout: 30000,
                headers: {
                    Authorization: 'Bearer ' + token
                }
			});
        };                              
        
        return worldNetworkUsersProvider;
    }    
);