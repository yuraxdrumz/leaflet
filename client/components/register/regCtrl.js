(function(){
    angular.module('myApp')
        .controller('regCtrl', ['auth','$location', function(auth,$location){
            var self = this;
            self.user = {};
            //register function
            self.register = function(){
                auth.register(self.user).then(function(res){
                    $location.path('/main')
                }).catch(function(err){
                    //catch error and pass to user, email is taken
                    self.error = err.data.message;
                    bootbox.alert({
                        size:'small',
                        title: 'An Error Occured',
                        message: self.error,
                    });
                });
            };
        }])
})()
