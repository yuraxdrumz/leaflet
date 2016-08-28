(function(){
    angular.module('myApp')
        .controller('mainCtrl', ['auth', 'trips', '$location', function(auth, trips,$location){
            var self = this;
            if(!auth.isLoggedIn()){
                $location.path('/')
            }else{
                trips.load(auth.currentUser()._id).then(function(res){
                    self.allTrips = res.data;
                })
            }


        }])
})()
