/*
 * Scientilla v1.0 Beta (http://www.scientilla.net)
 * Copyright 2014-2015 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */

angular.module("peer").factory(
    "peersService", function($http) {
        var peersProvider = {};
        
        peersProvider.getPeers = function(token, config) {
            return $http({
				method: "GET",
				url: "/api/peers",
                params: config,
                cache: false,
                timeout: 30000,
                headers: {
                    Authorization: 'Bearer ' + token
                }
			});
        };
        
        peersProvider.getSeedPeers = function(token) {
            return $http({
				method: "GET",
				url: "/api/seed-peers",
                cache: false,
                timeout: 30000,
                headers: {
                    Authorization: 'Bearer ' + token
                }
			});
        };
        
        peersProvider.getAggregatedPeers = function(token) {
            return $http({
				method: "GET",
				url: "/api/aggregated-peers",
                cache: false,
                timeout: 30000,
                headers: {
                    Authorization: 'Bearer ' + token
                }
			});
        };
        
        peersProvider.getCustomPeers = function(token) {
            return $http({
				method: "GET",
				url: "/api/custom-peers",
                cache: false,
                timeout: 30000,
                headers: {
                    Authorization: 'Bearer ' + token
                }
			});
        };
        
        peersProvider.getAggregatedAndCustomPeers = function(token, config) {
            return $http({
				method: "GET",
				url: "/api/aggregated-and-custom-peers",
                cache: false,
                params: config,
                timeout: 30000,
                headers: {
                    Authorization: 'Bearer ' + token
                }
			});
        };        
        
        peersProvider.getPeer = function(id, token) {
            return $http({
				method: "GET",
				url: "/api/peers/" + id,
                cache: false,
                timeout: 30000,
                headers: {
                    Authorization: 'Bearer ' + token
                }
			});
        };
        
        peersProvider.createPeer = function(data, token) {
            return $http({
				method: "POST",
				url: "/api/peers",
                data: data,
                cache: false,
                timeout: 30000,
                headers: {
                    Authorization: 'Bearer ' + token
                }
			});
        };
        
        peersProvider.updatePeer = function(data, token) {
            return $http({
				method: "PUT",
				url: "/api/peers/" + data.id,
                data: data,
                cache: false,
                timeout: 30000,
                headers: {
                    Authorization: 'Bearer ' + token
                }
			});
        };
        
        peersProvider.deletePeer = function(id, token) {
            return $http({
				method: "DELETE",
				url: "/api/peers/" + id,
                cache: false,
                timeout: 30000,
                headers: {
                    Authorization: 'Bearer ' + token
                }
			});
        };        
        
        peersProvider.setPeerAsShared = function(id, token) {
            return $http({
				method: "PUT",
				url: "/api/peers/" + id,
                data: { sharing_status: true },
                cache: false,
                timeout: 30000,
                headers: {
                    Authorization: 'Bearer ' + token
                }
			});
        };
        
        peersProvider.setPeerAsNotShared = function(id, token) {
            return $http({
				method: "PUT",
				url: "/api/peers/" + id,
                data: { sharing_status: false },
                cache: false,
                timeout: 30000,
                headers: {
                    Authorization: 'Bearer ' + token
                }
			});
        };
        
        peersProvider.setPeerAsAggregated = function(id, token) {
            return $http({
				method: "PUT",
				url: "/api/peers/" + id,
                data: { aggregating_status: true },
                cache: false,
                timeout: 30000,
                headers: {
                    Authorization: 'Bearer ' + token
                }
			});
        };
        
        peersProvider.setPeerAsNotAggregated = function(id, token) {
            return $http({
				method: "PUT",
				url: "/api/peers/" + id,
                data: { aggregating_status: false },
                cache: false,
                timeout: 30000,
                headers: {
                    Authorization: 'Bearer ' + token
                }
			});
        };
        
        return peersProvider;
    }    
);