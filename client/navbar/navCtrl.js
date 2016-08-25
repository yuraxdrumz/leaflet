(function(){
    angular.module('myApp')
        .controller('navCtrl', ['$http','auth','$location', function($http, auth,$location){
            var self = this;
            self.logout = function(){
                auth.logout()
                $location.path('/')
            }
            self.$onInit = function(){
                if(($location.url() === '/main') || ($location.url() === '/map')){
                    self.logged = true
                }
            }
        }])
})()
