(function(){
    angular.module('myApp')
        .controller('navCtrl',['$scope','$state','auth', function($scope,$state,auth){

        $scope.isActive = function(location){
            return location === $state.current.name;
        };
        $scope.$watch(auth.isLoggedIn,function(newVal, oldVal){
            if(newVal === true){
                $scope.logged = true;
            }else{
                $scope.logged = false
            }
        });

    }])
})()
