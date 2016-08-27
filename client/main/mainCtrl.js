(function(){
    angular.module('myApp')
        .controller('mainCtrl', ['auth','$location', function(auth,$location){
            var self = this;
            if(!auth.isLoggedIn()){
                $location.path('/')
            }

        }])
})()
