(function(){
    angular.module('myApp')
        .controller('homeCtrl', ['auth','$location', function(auth,$location){
            //logout when on main page
            auth.logout();
            // for scope saving
            var self = this;

            self.user = {};
            //login function
            self.login = function(){
                auth.login(self.user).then(function(){
                    $location.path('/main');

                }).catch(function(err){
                    //if error catch it here and pass to user, either wrong password or user not found
                    self.error = err.data.message;
                    bootbox.alert({
                        size:'small',
                        title: 'An Error Occured',
                        message: self.error,
                    });
                });
            };
            //forgot password onclick opens prompt
            self.forgotPassword = function(){
            bootbox.prompt({
                title: "What is your recovery Email",
                size: "small",
                callback:function(result){
                    if((result !== null) && (result !== undefined)){
                        bootbox.alert({
                            size:'small',
                            title:'Recovery',
                            message:'Password recovery has been sent to ' + result
                        });
                    };
                }
                });
            };
        }]);
})()
