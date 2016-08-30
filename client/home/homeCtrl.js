(function(){
    angular.module('myApp')
        .controller('homeCtrl', ['$http','auth','$location', function($http, auth,$location){
            auth.logout();
            var self = this;

            self.user = {};
            self.login = function(){
                auth.login(self.user).then(function(){
                    $location.path('/main');

                }).catch(function(err){
                    self.error = err.data.message;
                    $('.error-modal').modal();

                })
            }

        }])
})()
