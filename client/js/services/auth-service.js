(function(){
    angular.module('myApp')
    .factory('auth',['$http','$window',function($http, $window){
        var saveToken = function(token){
            $window.localStorage['token'] = token;
        };
        var getToken = function(){
            return $window.localStorage['token'];
        }
        var register = function(user){
            return $http.post('/api/register', user).then(function(res){
                return saveToken(res.data.token)
            })
            .catch(function(err){
                throw err.data
            })
        }
        var login = function(user){
            return $http.post('/api/login', user).then(function(res){
                return saveToken(res.data.token);
            })
            .catch(function(err){
                throw err.data
            })
        }
        var isLoggedIn = function(){
            var token = getToken();
            var payload;
            if(token){
                payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                return payload.exp > Date.now()/1000;
            }else{
                return false
            }
        }
        return{
            saveToken:saveToken,
            register:register,
            getToken:getToken,
            isLoggedIn:isLoggedIn,
            login:login
        }
    }])
})()
