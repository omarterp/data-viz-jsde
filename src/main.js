var d3 = require('d3');

window.initMap = function() {
  // stations = loadData();

  let mapCanvas = document.getElementById("map");
  let myCenter = new google.maps.LatLng(40.7326, -73.9582);
  let mapOptions = {
    center: myCenter,
    zoom: 12,
    mapTypeId: 'terrain'
  };
  let map = new google.maps.Map(mapCanvas, mapOptions);

  setMarkers(map, period = 'all');
}

// function loadData() {
//   let data_set = []
//   stations_2013 = d3.csv('/data/stations_2013', function(err, data) {
//     if(err) throw err;
//   });
//
//   stations_2014 = d3.csv('/data/stations_2014', function(err, data) {
//     if(err) throw err;
//   });
//
//   stations_2015 = d3.csv('/data/stations_2015', function(err, data) {
//     if(err) throw err;
//   });
//
//   stations_2016 = d3.csv('/data/stations_2016', function(err, data) {
//     if(err) throw err;
//   });
//
// }

function setMarkers(map, period) {

  // d3.queue()
  //   .defer(d3.csv, '/data/stations_2013')
  //   .defer(d3.csv, '/data/stations_2014')
  //   .defer(d3.csv, '/data/stations_2015')
  //   .defer(d3.csv, '/data/stations_2016')
  //   .defer(d3.csv, '/data/stations_all')
  //   .await(assignData);
  //
  // function assignData(error, stations_2013, stations_2014, stations_2015, stations_2016, stations_all) {
  //   if(error) throw error;
  //
  //   stations2013 = stations_2013;
  //   stations2014 = stations_2014;
  //   stations2015 = stations_2015;
  //   stations2016 = stations_2016;
  //   stationsAll = stations_all;
  // }


  switch (period) {
    case 'all':
      d3.csv('/data/stations_all', function (data) {
        createCharts(data);
        data.forEach(function(d) {
          //console.log(d.station_id);
          applyMarker(map, d.station_id,d.station_name, d.station_lat, d.station_long);
          //d["land area"] = +d["land area"];
          return;
        });

        // console.log(data);
        // applyMarker(map, data.station_id,data.station_name, data.station_lat, data.station_long);
        // console.log(data.station_id);
        // console.log(data.station_name);
        // console.log(data.station_lat);
        // console.log(data.station_long);
        // console.log(data.total_rides);
      });
  }
}

function createCharts(data) {

}

function applyMarker(map, station_id, station_name, station_lat, station_long) {

  // Adds markers to the map.

  // console.log(station_id)
  // console.log(station_name)
  // console.log(station_lat)
  // console.log(station_long)

  // Marker sizes are expressed as a Size of X,Y where the origin of the image
  // (0,0) is located in the top left of the image.

  // Origins, anchor positions and coordinates of the marker increase in the X
  // direction to the right and in the Y direction down.
  // var image = {
  //   url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
  //   // This marker is 20 pixels wide by 32 pixels high.
  //   size: new google.maps.Size(20, 32),
  //   // The origin for this image is (0, 0).
  //   origin: new google.maps.Point(0, 0),
  //   // The anchor for this image is the base of the flagpole at (0, 32).
  //   anchor: new google.maps.Point(0, 32)
  // };
  // Shapes define the clickable region of the icon. The type defines an HTML
  // <area> element 'poly' which traces out a polygon as a series of X,Y points.
  // The final coordinate closes the poly by connecting to the first coordinate.
  // var shape = {
  //   coords: [1, 1, 1, 20, 18, 20, 18, 1],
  //   type: 'poly'
  // };
  //   var beach = beaches[i];
  //   var marker =
    new google.maps.Marker({
      position: {lat: parseFloat(station_lat), lng: parseFloat(station_long)},
      map: map,
      icon: icons['info'].icon,
      // shape: shape,
      title: station_name,
      zIndex: parseFloat(station_id)
    });
}

