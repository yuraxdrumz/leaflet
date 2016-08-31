(function(){
    angular.module('myApp')
        .controller('mapCtrl', ['auth', 'trips', '$location', function(auth, trips, $location){
            if(!auth.isLoggedIn()){
                $location.path('/')
            }
            var self = this;

            //map tiles
            var blackAndWhite = L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png');

            //map init
            var mymap = L.map('leafmap').setView([32.32, 34.86], 10);

            //full screen control
            L.control.fullscreen({
                position: 'topleft',
                title: 'Show me the fullscreen !',
                titleCancel: 'Exit fullscreen mode',
                content: '<span class="glyphicon glyphicon-resize-full"></span>',
                forceSeparateButton: true,
                forcePseudoFullscreen: true,
                fullscreenElement: false
            }).addTo(mymap);

            //save button
            L.easyButton('fa fa-check-circle ', function(btn, map){
                self.saveNewTrip()
            }).addTo(mymap)

            //slide menu
            L.control.slideMenu('<div class="text-menu"><h2>Welcome To MyTrip</h2>' + '<p>Click on the map to add a marker, click on the marker and add your text in the input and press enter. Markers will be automatically joined with a line and the distance will be calculated for you.In order to delete a marker, simply press the right mouse button on it.All markers are draggable so do not be afraid to work with them.Be sure to add at least 2 markers and ENJOY.To save the trip press the check icon on the left</p></div>',{width:'250px',position:'topright'}).addTo(mymap);
            var mapnikLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap)
            L.control.layers({'Regular':mapnikLayer,'Black And White':blackAndWhite}).addTo(mymap)

            //polylines array
            var polilines = [];

            // markers array
            var full = [];

            // saving polylines to var
            var poli;

            // distance between markers
            var distance;

            // drag handler start
            function dragStartHandler(e){
                var latlngs = poli.getLatLngs();
                var latlng = this.getLatLng();
                for (var i = 0; i < latlngs.length; i++) {
                    if (latlng.equals(latlngs[i])) {
                        this.polylineLatlng = i;
                    }
                }
            }
            //drag handler event
            function dragHandler(e){
                var latlngs = poli.getLatLngs(),
                    latlng = this.getLatLng();
                latlngs.splice(this.polylineLatlng, 1, latlng);
                poli.setLatLngs(latlngs);
            }
            // drag handler finish
            function dragEndHandler(e){
                delete this.polylineLatlng;
                polilines = poli.getLatLngs()
            }
            // on click event
            mymap.on('click', function(e){
                // define marker
                var marker = L.marker(e.latlng,{draggable:true,bounceOnAdd:true});

                    // bind popup to it
                    marker.bindPopup('<input class="form-control pop-control" type="text" placeholder="add your stop here" id="message"/>');
                    marker.addTo(mymap);
                    //maker on click event
                    marker.on('click', function(e){
                        // set to center of map
                        mymap.panTo(e.latlng);
                        marker.openPopup();

                        // get the input inside popup
                        var input = L.DomUtil.get('message');
                        // event for enter on popup
                        input.addEventListener('keydown',function(e){
                            if(e.keyCode === 13){
                                marker.bindPopup(e.target.value);
                                full.push(marker);
                                polilines.push(marker.getLatLng());
                                if(full.length>1){
                                    if(poli != undefined){
                                        mymap.removeLayer(poli)
                                    }
                                    //add polyline to mao if markers length is more than 1
                                    poli = L.polyline(polilines)
                                    poli.addTo(mymap);
                                }
                                // events for marker after enter is pressed on input
                                marker.off('click');
                                marker.on('click', function(e){
                                    mymap.panTo(e.latlng)
                                    marker.openPopup();
                                })
                            }
                        });
                    });
                    // on right click event
                    marker.on('contextmenu', function(e){
                        // if marker did not receive input from user delete it
                        if(marker._popup._content === '<input class="form-control pop-control" type="text" placeholder="add your stop here" id="message"/>'){
                            mymap.removeLayer(marker)
                        }else{
                            // find marker in markers array and delete it
                            var index = full.indexOf(marker);
                            full.splice(index, 1);

                            // find the markers coords to delete from polyline
                            var second_index = polilines.indexOf(marker.getLatLng());
                            polilines.splice(second_index, 1);
                            //remove layers from map and add markers and new polyline again
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
            // save trip
            self.saveNewTrip = function(){
                var coords =[];
                var popups = [];
                var distance = 0;
                // for loop to calculate distance between markers
                for(var i=0,len=full.length;i<len;i++){
                    if(i<full.length-1){
                        distance += full[i]._latlng.distanceTo(full[i+1]._latlng)
                    }
                    // push coords and popups from markers array
                    coords.push(full[i].getLatLng())
                    popups.push(full[i]._popup._content)
                }
                // if the coords length is < 2 alert to add markers
                var all = {coords:coords,popups:popups,user_id:auth.currentUser()._id,user_email:auth.currentUser().email,distance:distance}
                if(all.coords.length < 2){
                    bootbox.alert('You need to add at least 2 markers for a trip, otherwise it is not a trip is it?')
                }else{
                    // save trip
                    trips.save(all).then(function(res){
                        $location.path('/main')
                    })
                }
            }
        }])
})()
