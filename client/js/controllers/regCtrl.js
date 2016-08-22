(function(){
    angular.module('myApp')
        .controller('regCtrl',['$scope', 'auth','$state', function($scope, auth,$state){
            $scope.register = function(){
                auth.register($scope.user).then(function(){
                    $state.go('main');
                })
            }
        }])
})()
