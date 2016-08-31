(function(){
    angular.module('myApp')
        .factory('trips', ['$http', function($http){
            var save = function(markers){
                return $http.post('/api/newtrip', markers).then(function(res){
                    return res
                }).catch(function(err){
                    throw err.data
                })
            };
            var load = function(user_id){
                return $http.get('/api/trips/' + user_id).then(function(res){
                    return res
                }).catch(function(err){
                    throw err.data
                })
            }
            var edit = function(id){
                return $http.get('/api/edit/' + id).then(function(res){
                    return res
                }).catch(function(err){
                    throw err.data
                })
            }
            var sendEdited = function(id, data){
                return $http.post('/api/edit/' + id,data).then(function(res){
                    return res
                }).catch(function(err){
                    throw err.data
                })
            }
            var deleteTrip = function(id){
                return $http.get('/api/delete/' + id).then(function(res){
                    return res
                }).catch(function(err){
                    throw err.data
                })
            }

            return {
                save:save,
                load:load,
                edit:edit,
                sendEdited:sendEdited,
                deleteTrip:deleteTrip
            }
        }])
})()
