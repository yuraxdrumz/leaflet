(function(){
    angular.module('myApp')
    .factory('auth',['$http','$window',function($http, $window){

        //save token on login or register
        var saveToken = function(token){
            return $window.localStorage['token'] = token;
        };
        //get token to authenticate
        var getToken = function(){
            return $window.localStorage['token'];
        }
        //register call with user object
        var register = function(user){
            return $http.post('/api/register', user).then(function(res){
                return saveToken(res.data.token)
            })
        };
        var logout = function() {
            return $window.localStorage.removeItem('token');
        };
        var login = function(user){
            return $http.post('/api/login', user).then(function(res){
                return saveToken(res.data.token);
            })
        }
        //checks if token is not expired and returns boolean
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
        //checks if token is valid and then extracts user info from it
        var currentUser = function(){
            if(isLoggedIn()){
                var token = getToken();
                var payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                return{
                    email:payload.email,
                    name:payload.name,
                    _id:payload._id,
                    username:payload.username
                }
            }
        }
        return{
            saveToken:saveToken,
            register:register,
            getToken:getToken,
            isLoggedIn:isLoggedIn,
            login:login,
            currentUser:currentUser,
            logout:logout
        }
    }])
})()
