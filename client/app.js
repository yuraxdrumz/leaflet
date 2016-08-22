(function(){
    angular.module('myApp',['ui.router','ngMessages'])
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('/');
        $stateProvider

            .state('home',{
                url:'/',
                templateUrl:'/templates/home.html',
                controller:'homeCtrl'
            })
            .state('register',{
                url:'/register',
                templateUrl:'/templates/register.html',
                controller:'regCtrl'
            })
            .state('main', {
                url:'/main',
                templateUrl:'/templates/main.html',
                controller:'mainCtrl'
        })
    }])
})()
