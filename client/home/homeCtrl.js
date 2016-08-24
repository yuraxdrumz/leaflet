(function(){
    angular.module('myApp')
        .controller('homeCtrl', ['$http','auth','$location', function($http, auth,$location){
            auth.logout();
            var self = this;
            self.logged = false;
            self.user = {};
            self.login = function(){
                auth.login(self.user).then(function(){
                    $location.path('/main');

                })
            }

        }])
})()
