(function(){
    angular.module('myApp')
        .controller('mapCtrl', ['auth', 'trips', '$location', function(auth, trips, $location){
            if(!auth.isLoggedIn()){
                $location.path('/')
            }
            var self = this;

            var blackAndWhite = L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png')
            var mymap = L.map('leafmap').setView([32.32, 34.86], 10);

            L.control.fullscreen({
                position: 'topleft',
                title: 'Show me the fullscreen !',
                titleCancel: 'Exit fullscreen mode',
                content: '<span class="glyphicon glyphicon-resize-full"></span>',
                forceSeparateButton: true,
                forcePseudoFullscreen: true,
                fullscreenElement: false
            }).addTo(mymap);
            L.easyButton('fa fa-check-circle ', function(btn, map){
                self.saveNewTrip()
            }).addTo(mymap)
            L.control.slideMenu('<div class="text-menu"><h2>Welcome To MyTrip</h2>' + '<p>Click on the map to add a marker, click on the marker and add your text in the input and press enter. Markers will be automatically joined with a line and the distance will be calculated for you.In order to delete a marker, simply press the right mouse button on it.All markers are draggable so do not be afraid to work with them.Be sure to add at least 2 markers and ENJOY.To save the trip press the check icon on the left</p></div>',{width:'250px',position:'topright'}).addTo(mymap);
            var mapnikLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap)
            L.control.layers({'Regular':mapnikLayer,'Black And White':blackAndWhite}).addTo(mymap)

            var polilines = [];
            var full = [];
            var poli;
            var distance;
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
                var marker = L.marker(e.latlng,{draggable:true,bounceOnAdd:true})
                    marker.bindPopup('<input class="form-control pop-control" type="text" placeholder="add your stop here" id="message"/>');
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
                        if(marker._popup._content === '<input class="form-control pop-control" type="text" placeholder="add your stop here" id="message"/>'){
                            mymap.removeLayer(marker)
                        }else{
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
                        }


                    });
                    marker.on('dragstart', dragStartHandler)
                    marker.on('drag', dragHandler);
                    marker.on('dragend', dragEndHandler)

                });
            self.saveNewTrip = function(){
                var coords =[];
                var popups = [];
                var distance = 0;

                for(var i=0,len=full.length;i<len;i++){
                    if(i<full.length-1){
                        distance += full[i]._latlng.distanceTo(full[i+1]._latlng)
                    }
                    coords.push(full[i].getLatLng())
                    popups.push(full[i]._popup._content)
                }
                var all = {coords:coords,popups:popups,user_id:auth.currentUser()._id,user_email:auth.currentUser().email,distance:distance}
                if(all.coords.length < 2){
                    bootbox.alert('You need to add at least 2 markers for a trip, otherwise it is not a trip is it?')
                }else{
                    trips.save(all).then(function(res){
                        $location.path('/main')
                    })
                }


            }
        }])
})()
