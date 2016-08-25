(function(){
    angular.module('myApp')
        .controller('mapCtrl', ['$http','auth','$location', function($http, auth,$location){
            var self = this;

            var mymap = L.map('leafmap').setView([32.32, 34.86], 13);
            var layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(mymap);
            var markers = [];
            var marker;
            var poli_counter = 1;
            var poli;
            var stop_counter = 1;
            mymap.on('click', function(e){
                var marker = L.marker(e.latlng,{draggable:true});

                    marker.bindPopup('<div>Stop number ' + stop_counter + '</div>' + '<input type="text" placeholder="add your stop here" id="message"  />')
                    marker.addTo(mymap)

                    markers.push(marker);



                    marker.on('click', function(e){
                        mymap.panTo(e.latlng);
                        marker.openPopup();
                        var input = L.DomUtil.get('message');
                        input.addEventListener('keydown',function(e){
                            if(e.keyCode === 13){

                                marker.bindPopup('<div>Stop number ' + stop_counter + '</div>' +  e.target.value);
                                stop_counter++;
                                if(markers.length>1){
                                    var latlngs = [];


                                    latlngs.push(new L.LatLng(markers[poli_counter-1]._latlng.lat,markers[poli_counter-1]._latlng.lng))
                                    latlngs.push(new L.LatLng(markers[poli_counter]._latlng.lat,markers[poli_counter]._latlng.lng))
                                    poli_counter++;

                                    poli = L.polyline(latlngs,
                                    {
                                        color: 'red',
                                        weight: 3,
                                        opacity: 0.5,
                                        smoothFactor: 1
                                    });
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
                        mymap.removeLayer(marker);
                        var index = markers.indexOf(marker);
                        markers.splice(index, 1);
                        mymap.removeLayer(poli);
                        console.log(markers)
                        poli_counter--;
                        stop_counter--;


                    })
                })

        }])
})()
