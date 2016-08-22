(function(){
    angular.module('myApp')
        .controller('homeCtrl',['$scope','auth','$state', function($scope,auth,$state){
            $scope.login = function(){
                auth.login($scope.user).then(function(){
                    $state.go('main')
                })
            }
        }])
})()
