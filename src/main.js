const d3 = require('d3');
const topojson = require('topojson-client');


var buttonData = {
  btn_2013: '/data/stations_2013',
  btn_2014: '/data/stations_2014',
  btn_2015: '/data/stations_2015',
  btn_2016: '/data/stations_2016',
  btn_all: '/data/stations_all_topo',
}

var buttonNames = {
  btn_2013: 'btn_2013',
  btn_2014: 'btn_2014',
  btn_2015: 'btn_2014',
  btn_2016: 'btn_2014',
  btn_all: 'btn_all',
}

window.init = function() {

  // Draw Map which will sit behind the points.
  drawMap();

  // set markers - pass in period
  updateMarkers('/data/stations_all_topo', 'all');
  drawAllBarChart();

  // Reset zoom
  // d3.timer(function() {
  //   svg.call(zoom.transform, d3.zoomIdentity);
  // }, 10000);

}

window.buttonPress = function(button) {

  const buttons = document.getElementsByTagName('button');

  for(i = 0; i < buttons.length; i++) {
    if(button.id === buttons[i].id) {
      let button = buttons[i];
      button.style.border = 'inset red';
      if(button.id in buttonData) {
        updateMarkers(buttonData[button.id])
      }
    } else {
      buttons[i].style.border = '';
    }
  };
}

// function setMarkers(data_file, period) {
//
//   const margin = {top: 50, right: 20, bottom: 50, left: 100},
//     width = parseInt(d3.select('#map').style('width')) - margin.left - margin.right,
//     height = parseInt(d3.select('#map').style('height')) - margin.top - margin.bottom;
//
//   const projection = d3.geoMercator()
//     .center([-73.94, 40.70])
//     .scale(65000)
//     .translate([width / 2, height / 2]);
//
//   const path = d3.geoPath()
//     .projection(projection);
//
//   const tooltip = d3.select('#map_tooltip')
//     .attr('class', 'hidden tooltip');
//
//   const map = d3.select('#map');
//
//   const marker_g = d3.select('#marker_g');
//
//   // Draw points
//   switch (period) {
//
//     case 'all':
//
//       document.getElementById(buttonNames.btn_all).style.border = 'inset red';
//
//       d3.json(data_file, function (error, topo) {
//
//         // Derive scale for points styling
//         const topoFeatures = topojson.feature(topo, topo.objects.stations).features;
//
//         let totalRides = [];
//         let medianAge = [];
//         let medianTrip = [];
//         // Retrieve pertinent data
//         topoFeatures.forEach(function(element) {
//           totalRides.push(element.properties.total_rides);
//           medianAge.push(element.properties.median_age);
//           medianTrip.push(element.properties.median_trip_duration);
//         });
//
//         const colorScale = d3.scaleLinear()
//           .domain([0, d3.max(totalRides)])
//           .range(['#eff3ff', '#3182bd', '#6baed6', '#08519c'])
//
//         marker_g.selectAll('.points')
//           .data(topojson.feature(topo, topo.objects.stations).features)
//           .enter()
//           .append('path')
//           .attr('class', 'points')
//           .attr('d', path.pointRadius(2))
//           .style('fill', function(d) {return colorScale(d.properties.total_rides)})
//           .on('mousemove', function(d) {
//             var mouse = d3.mouse(map.node()).map(function(d) {
//               return parseInt(d)
//             });
//             tooltip.classed('hidden', false)
//               .attr('style', 'left:' + (mouse[0] + 10) + 'px; top:' + (mouse[1] - 20) + 'px; position:absolute;')
//               .html('station name :  ' + d.properties.station_name +
//                 '<hr>' +
//                 'median ride duration : ' + d.properties.median_trip_duration + ' min. <br>' +
//                 'total rides : ' + d.properties.total_rides + '<br>' +
//                 'median age: ' + d.properties.median_age
//               );
//           })
//           .on('mouseout', function() {
//             tooltip.classed('hidden', true);
//           });
//
//         renderLegend(totalRides);
//
//         drawAllBarChart();
//       });
//   }
// }

function updateMarkers(data_file) {

  const margin = {top: 50, right: 20, bottom: 50, left: 100},
    width = parseInt(d3.select('#map').style('width')) - margin.left - margin.right,
    height = parseInt(d3.select('#map').style('height')) - margin.top - margin.bottom;

  const projection = d3.geoMercator()
    .center([-73.94, 40.70])
    .scale(65000)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath()
    .projection(projection);

  const tooltip = d3.select('#map_tooltip');

  const map = d3.select('#map');

  const marker_g = d3.select('#marker_g');

  marker_g.selectAll('.points').remove();

  d3.json(data_file, function (error, topo) {

    // Derive scale for points styling
    const topoFeatures = topojson.feature(topo, topo.objects.stations).features;

    let totalRides = [];
    let medianAge = [];
    let medianTrip = [];
    // Retrieve pertinent data
    topoFeatures.forEach(function (element) {
      totalRides.push(parseInt(element.properties.total_rides));
      medianAge.push(parseInt(element.properties.median_age));
      medianTrip.push(parseInt(element.properties.median_trip_duration));
    });

    const colorScale = d3.scaleLinear()
      .domain([0, d3.max(totalRides)])
      .range(['#eff3ff', '#3182bd', '#6baed6', '#08519c'])

    marker_g.selectAll('.points')
      .data(topojson.feature(topo, topo.objects.stations).features)
      .enter()
      .append('path')
      .attr('class', 'points')
      .attr('d', path.pointRadius(2))
      .style('fill', function(d) {return colorScale(d.properties.total_rides)})
      .on('mousemove', function(d) {
        var mouse = d3.mouse(map.node()).map(function(d) {
          return parseInt(d)
        });
        tooltip.classed('hidden', false)
          .attr('style', 'left:' + (mouse[0] + 10) + 'px; top:' + (mouse[1] - 20) + 'px; position:absolute;')
          .html('station name :  ' + d.properties.station_name +
            '<hr>' +
            'median ride duration : ' + d.properties.median_trip_duration + ' min. <br>' +
            'total rides : ' + d.properties.total_rides + '<br>' +
            'median age: ' + d.properties.median_age
          );
      })
      .on('mouseout', function() {
        tooltip.classed('hidden', true);
      });

    // remove legend and re-render
    d3.select('#legend_g').remove().exit();
    renderLegend(totalRides);

    // Create obj of ddta sets to draw histograms
    let dataSets = {
      medianAge: medianAge,
      medianTrip: medianTrip
    };

    drawHistograms(dataSets);
  });
}

function drawAllBarChart() {

  d3.csv('/data/stations_all', function (data) {

    const yearRideCount = d3.nest()
      .key(d => d.ride_year)
      .rollup(d => parseInt(d3.sum(d, leaf => leaf.total_rides)))
      .entries(data);

    const margin = {top: 30, right: 20, bottom: 50, left: 50},
      width = parseInt(d3.select('#chart').style('width')),
      height = parseInt(d3.select('#chart').style('height'));

    // chart group
    const chart_g = d3.select("#chart")
      .append('g')
      .attr('id', 'chart_g')

    const chart = d3.select('#chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height)
      .attr('transform', `translate(${window.innerWidth / 2}, 10)`);

    const x = d3.scaleBand()
      .domain(yearRideCount.map(d => d.key))
      .rangeRound([50, width - 50])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(yearRideCount, d => d.value) + 500000])
      .range([height - 50, 0]);

    const xAxis = d3.axisBottom().scale(x);
    const yAxis = d3.axisLeft().scale(y).tickFormat(function(d) {return d/1000000 + 'M'});

    // chart tooltip
    const tooltip = d3.select('#chart_tooltip')
      .attr('class', 'hidden tooltip');

    chart.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${height - 50})`)
      .call(xAxis);

    chart.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(50, 0)')
      .call(yAxis);

    // Label Y axis
    chart.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -125)
      .attr('y', 50)
      .attr('dy', '1em')
      .style('font-weight', 'bold')
      .text('Total Rides');

    chart.selectAll('rect')
      .data(yearRideCount)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.key))
      .attr('y', d => height - 50)
      .attr('width', x.bandwidth())
      .transition()
        .duration(2500)
        .delay((d, i) => i * 500)
        .attr('y', d => y(d.value))
        .attr('height', d => (height - 50) - y(d.value));

    chart.selectAll('rect')
      .append('text')
      .attr('class', 'bar text')
      .attr('dy', '1em')
      .attr('x', d => x(d.key))
      .attr('y', d => y(d.value) + 10)
      .attr('text-anchor', 'middle')
      .text(function(d) { return d.value });

  });

}

function drawHistograms(dataSets) {

  const medianAge = dataSets.medianAge;
  const medianTrip = dataSets.medianTrip;

  //svg groups
  age_g = d3.select("#ageHist").append('g').attr('id', 'age_g');
  trip_g = d3.select("#tripHist").append('g').attr('id', 'trip_g');

  // Create canvas boundaries.  Based on split chart specified in style sheet
  const margin = {top: 30, right: 20, bottom: 50, left: 50},
    width = parseInt(d3.select('#ageHist').style('width')),
    height = parseInt(d3.select('#ageHist').style('height'));

  /**
   * Create axes and appropriate scales -
   *  Two histograms will be rendered; median age and trip duration
   *  set the ranges
   **/
    // x is shared, baed on split-chart width
  const x = d3.scaleLinear()
    .rangeRound([0, width]);

  // initiate histograms for each distribution
  const ageHist = d3.histogram()
    .domain(x.domain)
    .thresholds(x.ticks(20))
    (medianAge);

  const tripHistogram = d3.histogram()
    .domain(x.domain)
    .thresholds(x.ticks(20))
    (medianTrip);

  // Age
  const yA = d3.scaleLinear()
    .domain([0, d3.max(ageHist, function(d) { return d.length })])
    .range([height, 0]);

  // Trip
  const yT = d3.scaleLinear()
    .domain([0, d3.max(tripHistogram, function(d) { return d.length })])
    .range([height, 0]);

  console.log(ageHist);
  console.log(medianAge);
  console.log(d3.range(1000).map(d3.randomBates(10)));
  const ageBar = age_g.selectAll('.bar')
    .data(ageHist)
    .enter().append('g')
    .attr('class', 'bar')
    .attr('transform', function(d) { return `translate(${x(d.x0)}, ${yA(d.length)})`});

  ageBar.append('rect')
    .attr('x', 1)
    .attr('width', x(ageHist[0].x1 - x(ageHist[0] - 1)))
    .attr('height', function(d) { return height - yA(d.length); })







}

function drawMap() {

  const margin = {top: 50, right: 20, bottom: 50, left: 100},
    width = parseInt(d3.select('#map').style('width')) - margin.left - margin.right,
    height = parseInt(d3.select('#map').style('height')) - margin.top - margin.bottom;

  const map = d3.select('#map')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const projection = d3.geoMercator()
    .center([-73.94, 40.70])
    .scale(65000)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath()
    .projection(projection);

  const zoom = d3.zoom()
    .scaleExtent([1, 3])
    .on('zoom', function () {
      d3.select('#transform_g').attr('transform', d3.event.transform)
    });

  zoom.scaleExtent([1, Math.min(width, height)]);

  var svg = d3.select('#map')
    .attr('width', width)
    .attr('height', height)
    .call(zoom);

  // group for overall transformed map; encloses other g layers
  const transform_g = svg.append('g').attr('id','transform_g');
  // group for polys
  const poly_g = transform_g.append('g').attr('id','poly_g');
  // group for markers, on top
  const marker_g = transform_g.append('g').attr('id','marker_g');

  d3.json('/data/nyc-zip-polys', function(error, topo) {

    poly_g.selectAll('.zips')
      .data(topojson.feature(topo, topo.objects.nyc).features)
      .enter()
      .append('path')
      .attr('class', 'zips')
      .attr('d', path);
  });

  // Gratuitous intro zoom!
  svg.call(zoom).transition()
    .duration(5000)
    .call(zoom.transform, d3.zoomIdentity
      .scale(3)
      .translate(-(width / 3.5), (-(height / 4)) + 5));

  // return the marker group
  return marker_g;
}

// Build Legend
function renderLegend(valueRange) {

  // add legend group to transform group
  const transform_g = d3.select('#transform_g');

  const legend_g = transform_g.append('g').attr('id', 'legend_g')
    .style('position', 'absolute');

  const legendWidth = 10,
    legendHeight = 50

  const legendScale = d3.scaleLinear()
    .domain([d3.min(valueRange), d3.max(valueRange)])
    .range([0, legendHeight - 1]);

  // legend axis
  const legendAxis = d3.axisRight()
    .scale(legendScale)
    .tickSize(1)
    .tickFormat(function(d) {return d/1000 + 'k'})
    .ticks(3);

  const gradient = legend_g
    .append('linearGradient')
    .attr('id', 'gradient')
    .attr('x1', '0%')
    .attr('x2', '0%')
    .attr('y1', '100%')
    .attr('y2', '0%');

  // configure gradient scale
  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#08519c')
    .attr('stop-opacity', 1);

  gradient
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#eff3ff')
    .attr('stop-opacity', 1);

  // legend with color scale gradient
  legend_g
    .append('rect')
    .attr('x', window.innerWidth / 4 - 50)
    .attr('y', window.innerHeight / 3 + 50)
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .attr('fill', 'url(#gradient)');

  legend_g
    .append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${(window.innerWidth / 4 - 50) + 10}, ${(window.innerHeight / 3 + 50)})`)
    .call(legendAxis);

}
