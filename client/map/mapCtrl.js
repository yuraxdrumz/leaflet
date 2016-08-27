(function(){
    angular.module('myApp')
        .controller('mapCtrl', ['auth', 'trips', '$location', function(auth, trips, $location){
            if(!auth.isLoggedIn()){
                $location.path('/')
            }
            var self = this;
            var mymap = L.map('leafmap').setView([32.32, 34.86], 10);
            var layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(mymap);
            var poli_count = 1;
            var polilines = [];
            var full = [];
            var poli;
            function dragStartHandler(e){
                var latlngs = poli.getLatLngs();
                var latlng = this.getLatLng();
                for (var i = 0; i < latlngs.length; i++) {
                    if (latlng.equals(latlngs[i])) {
                        this.polylineLatlng = i;
                    }
                }
            }
            function dragHandler(e){
                var latlngs = poli.getLatLngs(),
                    latlng = this.getLatLng();
                latlngs.splice(this.polylineLatlng, 1, latlng);
                poli.setLatLngs(latlngs);
            }
            function dragEndHandler(e){
                delete this.polylineLatlng;
                polilines = poli.getLatLngs()
            }
            mymap.on('click', function(e){

                var marker = L.marker(e.latlng,{draggable:true});
                    marker.bindPopup('<input type="text" placeholder="add your stop here" id="message"/>');
                    marker.addTo(mymap);

                    marker.on('click', function(e){
                        mymap.panTo(e.latlng);
                        marker.openPopup();
                        var input = L.DomUtil.get('message');

                        input.addEventListener('keydown',function(e){
                            if(e.keyCode === 13){
                                marker.bindPopup(e.target.value);
                                full.push(marker);
                                polilines.push(marker.getLatLng());
                                if(full.length>1){
                                    if(poli != undefined){
                                        mymap.removeLayer(poli)
                                    }
                                    poli = L.polyline(polilines)
                                    poli.addTo(mymap);
                                    poli_count++;
                                }
                                marker.off('click');
                                marker.on('click', function(e){
                                    mymap.panTo(e.latlng)
                                    marker.openPopup();
                                })
                            }
                        });
                    });

                    marker.on('contextmenu', function(e){
                        var index = full.indexOf(marker);
                        full.splice(index, 1);
                        var second_index = polilines.indexOf(marker.getLatLng());
                        polilines.splice(second_index, 1);
                        mymap.eachLayer(function(layer){
                            mymap.removeLayer(layer);
                        })
                        var layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(mymap);
                        for(var i=0,len=full.length;i<len;i++){
                            full[i].addTo(mymap)
                        }
                        poli = L.polyline(polilines).addTo(mymap)
                        if(full.length === 0 ){
                            poli_count = 1;
                        }else{
                            poli_count = full.length;
                        }
                    });
                    marker.on('dragstart', dragStartHandler)
                    marker.on('drag', dragHandler);
                    marker.on('dragend', dragEndHandler)

                });
            self.saveNewTrip = function(){
                var coords =[];
                var popups = [];
                var all = {coords:coords,popups:popups,user_id:auth.currentUser()._id,user_email:auth.currentUser().email}
                for(var i=0,len=full.length;i<len;i++){
                    coords.push(full[i].getLatLng())
                    popups.push(full[i]._popup._content)
                }
                trips.save(all).then(function(res){
                    $location.path('/main')
                })

            }
        }])
})()
