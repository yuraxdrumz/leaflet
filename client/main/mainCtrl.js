(function(){
    angular.module('myApp')
        .controller('mainCtrl', ['$http','auth','$location', function($http, auth,$location){
            var self = this;
            if(!auth.isLoggedIn()){
                $location.path('/')
            }

        }])
})()
