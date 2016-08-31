(function(){
    angular.module('myApp')
        .controller('mainCtrl', ['auth', 'trips', '$location', function(auth, trips,$location){
            var self = this;
            //check if token is valid, if not send to main
            if(!auth.isLoggedIn()){
                $location.path('/')
            }else{
                //load trips with users id
                trips.load(auth.currentUser()._id).then(function(res){
                    for(var i=0,len=res.data.length;i<len;i++){
                        res.data[i].created = moment(res.data[i].created).fromNow()
                    }
                    self.allTrips = res.data.reverse();
                })
            }
            //delete trip option
            self.delete = function(trip){
                bootbox.confirm({
                    title: 'Delete Trip',
                    message: 'Are you sure you want to delete this Trip? If not, click Cancel. There is no undo!l',
                    buttons: {
                        'cancel': {
                            label: 'Cancel',
                            className: 'btn-default pull-right'
                        },
                        'confirm': {
                            label: 'Delete',
                            className: 'btn-danger pull-left'
                        }
                    },
                    callback: function(result) {
                        if (result) {
                            trips.deleteTrip(trip._id).then(function(){
                                var index = self.allTrips.indexOf(trip);
                                self.allTrips.splice(index, 1);
                            })
                        }
                    }
                });

            }



        }])
})()
