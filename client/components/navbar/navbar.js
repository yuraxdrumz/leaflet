(function(){
    angular.module('myApp')
    .component('nav',{
        templateUrl:'/navbar/navbar.html',
        controllerAs:'ctrl',
        controller: 'navCtrl'
    })
})()
