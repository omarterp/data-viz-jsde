import * as d3 from 'd3';

window.initMap = function() {
  let mapCanvas = document.getElementById("map");
  let myCenter = new google.maps.LatLng(51.508742, -0.120850)
  let mapOptions = {
    center: myCenter,
    zoom: 5,
    mapTypeId: 'terrain'
  };
  var map = new google.maps.Map(mapCanvas, mapOptions);

  var marker = new google.maps.Marker({position: myCenter});
  marker.setMap(map);
 loadData();
}

function loadData() {
  d3.json("/data/stations_2014.json", function(data) {
    console.log(data[0]);
  });
}


