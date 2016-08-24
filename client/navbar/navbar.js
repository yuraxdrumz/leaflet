(function(){
    angular.module('myApp')
    .component('nav',{
        bindings:{
            logged:'='
        },
        templateUrl:'/navbar/navbar.html',
        controllerAs:'ctrl',
        controller: 'navCtrl'
    })
})()
