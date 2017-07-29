import React, { PropTypes } from 'react';

function myMap() {
  let mapCanvas = document.getElementById("map");
  let myCenter = new google.maps.LatLng(51.508742, -0.120850)
  let mapOptions = {
    center: myCenter,
    zoom: 5
  };
  var map = new google.maps.Map(mapCanvas, mapOptions);

  var marker = new google.maps.Marker({position: myCenter});
  marker.setMap(map);
}

function initMap() {
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyAREOfk0rq7BbweSW1uRJwh62sAbDWuNI0&callback=myMap"
}
