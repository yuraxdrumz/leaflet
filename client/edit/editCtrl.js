(function(){
    angular.module('myApp')
        .controller('editCtrl', ['trips','auth','$location','$routeParams', function(trips, auth,$location,$routeParams){
            var self = this;
            if(!auth.isLoggedIn()){
                $location.path('/')
            }
            var cur;
            var mymap;
            var markers = [];
            var full = [];
            var distance;
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
                markers = poli.getLatLngs()
            }
            self.$onInit = function(){
                trips.edit($routeParams.id).then(function(res){
                    return res.data[0];
                }).then(function(cur){
                    for(var i=0,len=cur.coords.length;i<len;i++){
                        var marker = L.marker(cur.coords[i],{draggable:true}).addTo(mymap)
                        marker.bindPopup('<input value="'+ cur.popups[i] +'" class="form-control pop-control" type="text" placeholder="add your stop here" id="message"/>');
                        markers.push(cur.coords[i]);
                        full.push(marker);
                        (function(marker){
                            marker.on('click', function(e){
                                mymap.panTo(e.latlng);
                                marker.openPopup();
                                var input = L.DomUtil.get('message');
                                input.addEventListener('keydown',function(e){
                                    if(e.keyCode === 13){
                                        marker.bindPopup(e.target.value);
                                        marker.off('click');
                                        marker.on('click', function(e){
                                            mymap.panTo(e.latlng)
                                            marker.openPopup();
                                        })

                                    }
                                })
                            })
                            marker.on('dragstart', dragStartHandler)
                            marker.on('drag', dragHandler);
                            marker.on('dragend', dragEndHandler)
                        })(marker)
                    }
                    poli = L.polyline(markers).addTo(mymap)
                    var bounds = L.latLngBounds(markers);
                    mymap.fitBounds(bounds);
                })
            }
            mymap = L.map('leafmap').setView([32.32, 34.86], 10);
            var blackAndWhite = L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png')
            var mapnikLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap)
            L.control.layers({'Regular':mapnikLayer,'Black And White':blackAndWhite}).addTo(mymap);

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
                                markers.push(marker.getLatLng());
                                distance = (marker._latlng.distanceTo(markers[0]))
                                if(full.length>1){
                                    if(poli){
                                        mymap.removeLayer(poli)
                                    }
                                    poli = L.polyline(markers)
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
                            var second_index = markers.indexOf(marker.getLatLng());
                            markers.splice(second_index, 1);
                            mymap.eachLayer(function(layer){
                                mymap.removeLayer(layer);
                            })
                            var layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(mymap);
                            for(var i=0,len=full.length;i<len;i++){
                                full[i].addTo(mymap)
                            }
                            poli = L.polyline(markers).addTo(mymap)
                        }


                    });
                    marker.on('dragstart', dragStartHandler)
                    marker.on('drag', dragHandler);
                    marker.on('dragend', dragEndHandler)
            });
            self.editTrip = function(e){
                var popups = [];
                for(var i=0,len=full.length;i<len;i++){
                    if(full[i]._popups._content.includes('<input>')){
                        console.log('true')
                    }
                    popups.push(full[i]._popup._content)
                }
                var edited = {popups:popups,coords:markers}
                trips.sendEdited($routeParams.id,edited).then(function(){
                    $location.path('/main')
                })
            }
        }])
})()
