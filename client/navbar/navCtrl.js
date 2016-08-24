(function(){
    angular.module('myApp')
        .controller('navCtrl', ['$http','auth','$location', function($http, auth,$location){
            var self = this;
            self.logout = function(){
                auth.logout()
                $location.path('/')
            }
        }])
})()
