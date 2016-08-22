(function(){
    angular.module('myApp')
        .controller('mainCtrl',['$scope','auth','$state', function($scope,auth,$state){
            if(!auth.isLoggedIn()){
                $state.go('home')
            }
        }])
})()
