(function(){
    angular.module('myApp')
        .controller('mainCtrl', ['auth', 'trips', '$location', function(auth, trips,$location){
            var self = this;
            if(!auth.isLoggedIn()){
                $location.path('/')
            }else{
                trips.load(auth.currentUser()._id).then(function(res){
                    for(var i=0,len=res.data.length;i<len;i++){
                        res.data[i].created = moment(res.data[i].created).fromNow()
                    }
                    self.allTrips = res.data.reverse();
                })
            }



        }])
})()
