(function(){
    angular.module('myApp')
        .controller('mapCtrl', ['$http','auth','$location', function($http, auth,$location){
            var self = this;

            var mymap = L.map('leafmap').setView([32.32, 34.86], 13);
            var layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(mymap);
            var markers = [];
            var poli_count = 1;
            var polilines = [];
            var full = [];
            mymap.on('click', function(e){

                var marker = L.marker(e.latlng,{draggable:true});

                    marker.bindPopup('<input type="text" placeholder="add your stop here" id="message"/>')
                    marker.addTo(mymap)

                    marker.on('click', function(e){
                        mymap.panTo(e.latlng);
                        marker.openPopup();
                        var input = L.DomUtil.get('message');

                        input.addEventListener('keydown',function(e){
                            if(e.keyCode === 13){
                                marker.bindPopup(e.target.value);
                                markers.push(marker._latlng);
                                full.push(marker);
                                if(markers.length>1){
                                    if(poli_count === 1){
                                        var poli = L.polyline([markers[poli_count-1],markers[poli_count]],{
                                            color:'red'
                                        })
                                    }else{
                                        var poli = L.polyline([markers[poli_count-1],markers[poli_count]])
                                    }

                                    poli.addTo(mymap);
                                    polilines.push(poli);
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
                        mymap.removeLayer(marker)
                        var index = markers.indexOf(marker._latlng);
                        markers.splice(index, 1);
                        var second_index = full.indexOf(marker);
                        full.splice(second_index, 1);
                        mymap.eachLayer(function(layer){
                            mymap.removeLayer(layer);
                        })
                        var layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(mymap);
                        for(var i=1,len=markers.length;i<len;i++){
                            if(i === 1){
                                var newPoli = L.polyline([markers[i-1],markers[i]],{color:'red'});
                            }else{
                                var newPoli = L.polyline([markers[i-1],markers[i]]);
                            }

                            newPoli.addTo(mymap);

                        }
                        for(var i=0,len=markers.length;i<len;i++){
                            full[i].addTo(mymap)
                        }
                        if(markers.length === 0 ){
                            poli_count = 1;
                        }else{
                            poli_count = markers.length;
                        }


                    })
                })
        }])
})()
