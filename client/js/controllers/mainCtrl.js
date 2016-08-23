(function(){
    angular.module('myApp')
        .controller('mainCtrl',['$scope','auth','$state', function($scope,auth,$state){
            if(!auth.isLoggedIn()){
                $state.go('home')
            }else{
                $scope.user = auth.currentUser();
                $scope.logged = true;
            }

            $scope.$watch(auth.isLoggedIn,function(newVal, oldVal){
                if(newVal === false){
                    $scope.logged = false;
                    $state.go('home')
                }

            });

        }])
})()
