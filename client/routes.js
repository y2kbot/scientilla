/*
 * Scientilla v1.0 Beta (http://www.scientilla.net)
 * Copyright 2014-2015 Fondazione Istituto Italiano di Tecnologia (http://www.iit.it)
 * Licensed under MIT (https://github.com/scientilla/scientilla/blob/master/LICENSE)
 */

angular.module("scientilla").config([
    "$routeProvider", 
    function($routeProvider) {
        $routeProvider.when("/", {
            templateUrl: "application/plugins/reference/partials/local-browsing.html",
            controller: "localReferencesBrowsingController"
            
        // DATASETS
        }).when("/browse-datasets/", {
            templateUrl: "application/plugins/dataset/partials/local-browsing.html",
            controller: "localDatasetsBrowsingController"
        }).when("/browse-peer-datasets/:peerId/", {
            templateUrl: "application/plugins/dataset/partials/peer-browsing.html",
            controller: "peerDatasetsBrowsingController"              
        }).when("/add-dataset/", {
            templateUrl: "application/plugins/dataset/partials/addition.html",
            controller: "datasetAdditionController"
        }).when("/edit-dataset/:id/", {
            templateUrl: "application/plugins/dataset/partials/editing.html",
            controller: "datasetEditingController"
        }).when("/delete-dataset/:id/", {
            templateUrl: "application/plugins/dataset/partials/deletion.html",
            controller: "datasetDeletionController"
            
        // NETWORK
        }).when("/browse-network/", {
            templateUrl: "application/plugins/network/partials/browsing.html",
            controller: "networkReferencesBrowsingController"
        }).when("/browse-local-network-users/:userType", {
            templateUrl: "application/plugins/user/partials/network-browsing.html",
            controller: "networkUsersBrowsingController"           
        }).when("/browse-world-network/", {
            templateUrl: "application/plugins/network/partials/world-browsing.html",
            controller: "worldNetworkReferencesBrowsingController"            
        }).when("/browse-world-network/:id/", {
            templateUrl: "application/plugins/network/partials/world-detail.html",
            controller: "worldDetailController"
        }).when("/browse-network-users/", {
            templateUrl: "application/plugins/user/partials/network-browsing.html",
            controller: "networkUsersBrowsingController"
        }).when("/browse-world-network-users/:userType", {
            templateUrl: "application/plugins/user/partials/world-network-browsing.html",
            controller: "worldNetworkUsersBrowsingController"           
        }).when("/browse-world-network-users/:id/", {
            templateUrl: "application/plugins/user/partials/world-network-details.html",
            controller: "worldNetworkUserDetailsController"            
            
        // PEERS
        }).when("/browse-peers/", {
            templateUrl: "application/plugins/peer/partials/local-browsing.html",
            controller: "localPeersBrowsingController"
        }).when("/browse-world-peers/", {
            templateUrl: "application/plugins/peer/partials/world-browsing.html",
            controller: "worldPeersBrowsingController"            
        }).when("/add-peer/", {
            templateUrl: "application/plugins/peer/partials/addition.html",
            controller: "peerAdditionController"
        }).when("/edit-peer/:id/", {
            templateUrl: "application/plugins/peer/partials/editing.html",
            controller: "peerEditingController"
        }).when("/delete-peer/:id/", {
            templateUrl: "application/plugins/peer/partials/deletion.html",
            controller: "peerDeletionController"
            
        // REFERENCES
        }).when("/browse-references/", {
            templateUrl: "application/plugins/reference/partials/local-browsing.html",
            controller: "localReferencesBrowsingController"
        }).when("/browse-dataset-references/:peerId/:datasetId/", {
            templateUrl: "application/plugins/reference/partials/dataset-browsing.html",
            controller: "datasetReferencesBrowsingController"            
        }).when("/browse-peer-references/:peerId/", {
            templateUrl: "application/plugins/reference/partials/peer-browsing.html",
            controller: "peerReferencesBrowsingController"
        }).when("/browse-repository-references/:repositoryId/", {
            templateUrl: "application/plugins/reference/partials/repository-browsing.html",
            controller: "repositoryReferencesBrowsingController"
        }).when("/browse-received-references/", {
            templateUrl: "application/plugins/reference/partials/received-browsing.html",
            controller: "receivedReferencesBrowsingController"
        }).when("/browse-collected-references/", {
            templateUrl: "application/plugins/reference/partials/collected-browsing.html",
            controller: "collectedReferencesBrowsingController"            
        }).when("/add-reference/", {
            templateUrl: "application/plugins/reference/partials/addition.html",
            controller: "referenceAdditionController"
        }).when("/open-reference/:id/", {
            templateUrl: "application/plugins/reference/partials/opening.html",
            controller: "referenceOpeningController"            
        }).when("/edit-reference/:id/", {
            templateUrl: "application/plugins/reference/partials/editing.html",
            controller: "referenceEditingController"
        }).when("/copy-reference/:id/", {
            templateUrl: "application/plugins/reference/partials/addition.html",
            controller: "referenceCopyController"
        }).when("/delete-reference/:id/", {
            templateUrl: "application/plugins/reference/partials/deletion.html",
            controller: "referenceDeletionController"
        }).when("/clone-reference/:id/", {
            templateUrl: "application/plugins/reference/partials/local-cloning.html",
            controller: "localReferenceCloningController"              
        }).when("/clone-dataset-reference/:peerId/:datasetId/:referenceId/", {
            templateUrl: "application/plugins/reference/partials/dataset-cloning.html",
            controller: "datasetReferenceCloningController"
        }).when("/open-peer-reference/:peerId/:referenceId/", {
            templateUrl: "application/plugins/reference/partials/peer-opening.html",
            controller: "peerReferenceOpeningController"             
        }).when("/clone-peer-reference/:peerId/:referenceId/", {
            templateUrl: "application/plugins/reference/partials/peer-cloning.html",
            controller: "peerReferenceCloningController"
        }).when("/clone-repository-reference/:repositoryId/:index/", {
            templateUrl: "application/plugins/reference/partials/repository-cloning.html",
            controller: "repositoryReferenceCloningController"
        }).when("/accept-received-reference/:id/", {
            templateUrl: "application/plugins/reference/partials/acceptation.html",
            controller: "receivedReferencesBrowsingController"
        }).when("/import-references/", {
            templateUrl: "application/plugins/reference/partials/importing.html",
            controller: "referencesImportingController"            
        
        // REPOSITORIES
        }).when("/browse-repositories/", {
            templateUrl: "application/plugins/repository/partials/local-browsing.html",
            controller: "localRepositoriesBrowsingController"          
        }).when("/add-repository/", {
            templateUrl: "application/plugins/repository/partials/addition.html",
            controller: "repositoryAdditionController"
        }).when("/edit-repository/:id/", {
            templateUrl: "application/plugins/repository/partials/editing.html",
            controller: "repositoryEditingController"
        }).when("/delete-repository/:id/", {
            templateUrl: "application/plugins/repository/partials/deletion.html",
            controller: "repositoryDeletionController"
        }).when("/import-repository/", {
            templateUrl: "application/plugins/repository/partials/importing.html",
            controller: "repositoryImportingController"            
            
        // SETTINGS
        }).when("/browse-settings/", {
            templateUrl: "application/plugins/setting/partials/browsing.html",
            controller: "settingsBrowsingController"
        
        // SYSTEM
        }).when("/login/", {
            templateUrl: "application/plugins/system/partials/login.html",
            controller: "systemAuthenticationController"            
        }).when("/start/", {
            templateUrl: "application/plugins/system/partials/start.html",
            controller: "systemAuthenticationController"            
        }).when("/logout/", {
            templateUrl: "application/plugins/system/partials/logout.html",
            controller: "systemAuthenticationController"
        
        // USERS
        }).when("/browse-users/", {
            templateUrl: "application/plugins/user/partials/browsing.html",
            controller: "usersBrowsingController"
        }).when("/add-user/", {
            templateUrl: "application/plugins/user/partials/addition.html",
            controller: "userAdditionController"
        }).when("/edit-user/", {
            templateUrl: "application/plugins/user/partials/self-editing.html",
            controller: "userSelfEditingController"            
        }).when("/edit-user/:id/", {
            templateUrl: "application/plugins/user/partials/editing.html",
            controller: "userEditingController"
        }).when("/delete-user/:id/", {
            templateUrl: "application/plugins/user/partials/deletion.html",
            controller: "userDeletionController" 
            
        // DISCOVERY
        }).when("/discovery/", {
            templateUrl: "application/plugins/discovery/partials/main.html",
            controller: "mainController"
            
        }); /*.otherwise({
            redirectTo: "/references/" 
        });*/
    }
]);