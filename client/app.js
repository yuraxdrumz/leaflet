(function(){
    angular.module('myApp',['ngRoute','ngMessages'])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/',{
                template:'<home></home>'
            })
            .when('/register',{
                template:'<register></register>'
            })
            .when('/main',{
                template:'<main></main>'
        })
    }])
})()
