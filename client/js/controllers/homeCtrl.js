(function(){
    angular.module('myApp')
        .controller('homeCtrl',['$scope','auth','$state', function($scope,auth,$state){
            //if user returns to home logout
            auth.logout();
            //login function
            $scope.login = function(){
                auth.login($scope.user).then(function(){
                    $state.go('main')
                })
            };

        }])
})()
