(function(){
    angular.module('myApp')
        .controller('regCtrl', ['$http','auth','$location', function($http, auth,$location){
            var self = this;
            self.user = {};
            self.register = function(){
                auth.register(self.user).then(function(res){
                    $location.path('/main')
                }).catch(function(err){
                    self.error = err.data.message;
                    $('.error-modal').modal();
                })

            }

        }])
})()
