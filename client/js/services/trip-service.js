(function(){
    angular.module('myApp')
        .factory('trips', ['$http', function($http){
            var save = function(markers){
                return $http.post('/api/newtrip', markers).then(function(res){
                    console.log(res)
                })
            }
            return {
                save:save
            }
        }])
})()
