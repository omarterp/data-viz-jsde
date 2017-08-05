const d3 = require('d3');
const topojson = require('topojson-client');

window.init = function() {

  // Draw Map which will sit behind the points.
  const marker_g = drawMap();

  // set markers - pass in period
  setMarkers(marker_g, 'all');

  // Reset zoom
  // d3.timer(function() {
  //   svg.call(zoom.transform, d3.zoomIdentity);
  // }, 10000);

}

window.buttonPress = function(button) {

  const buttons = document.getElementsByTagName('button');
  console.log(buttons);
  for(i = 0; i < buttons.length; i++) {
    if(button.id === buttons[i].id) {
      buttons[i].style.border = 'inset red';
    } else {
      buttons[i].style.border = '';
    }
  };
}

function setMarkers(marker_g, period) {

  const margin = {top: 50, right: 20, bottom: 50, left: 100},
    width = parseInt(d3.select('#map').style('width')) - margin.left - margin.right,
    height = parseInt(d3.select('#map').style('height')) - margin.top - margin.bottom;

  const projection = d3.geoMercator()
    .center([-73.94, 40.70])
    .scale(65000)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath()
    .projection(projection);

  const tooltip = d3.select('#tooltip')
    .attr('class', 'hidden tooltip');

  const svg = d3.selectAll('#map');

  // Draw points
  switch (period) {

    case 'all':

      document.getElementById("btn-all").style.border = 'inset red';

      d3.json('/data/stations_all_topo', function (error, topo) {

        // Derive scale for points styling
        const topoFeatures = topojson.feature(topo, topo.objects.stations).features;

        let totalRides = [];
        let medianAge = [];
        let medianTrip = [];
        // Retrieve pertinent data
        topoFeatures.forEach(function(element) {
          totalRides.push(element.properties.total_rides);
          medianAge.push(element.properties.median_age);
          medianTrip.push(element.properties.median_trip_duration);
        });

        // const colorScale = d3.scaleSequential(COLOR_SCHEME)
        //   .domain([0, d3.max(totalRides)]);

        const colorScale = d3.scaleLinear()
          .domain([0, d3.max(totalRides)])
          .range(['#eff3ff', '#3182bd', '#6baed6', '#08519c'])

        renderLegend(totalRides);

        marker_g.selectAll('.points')
          .data(topojson.feature(topo, topo.objects.stations).features)
          .enter()
          .append('path')
          .attr('class', 'points')
          .attr('d', path.pointRadius(2))
          .style('fill', function(d) {return colorScale(d.properties.total_rides)})
          .on('mousemove', function(d) {
            var mouse = d3.mouse(svg.node()).map(function(d) {
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

        renderLegend(marker_g, totalRides);

        drawAllBarChart();
      });
  }
}

function drawAllBarChart() {

  d3.csv('/data/stations_all', function (data) {

    const yearRideCount = d3.nest()
      .key(d => d.ride_year)
      .rollup(d => parseInt(d3.sum(d, leaf => leaf.total_rides)))
      .entries(data);

    const margin = {top: 50, right: 20, bottom: 50, left: 50},
      width = parseInt(d3.select('#chart').style('width')),
      height = parseInt(d3.select('#chart').style('height'));


    const chart = d3.select('#chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height)
      .attr('transform', 'translate(' + window.innerWidth / 2 + ',' + margin.top + ')');

    const x = d3.scaleBand()
      .domain(yearRideCount.map(d => d.key))
      .rangeRound([50, width - 50])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(yearRideCount, d => d.value)])
      .range([height - 50, 0]);

    const xAxis = d3.axisBottom().scale(x);
    const yAxis = d3.axisLeft().scale(y).tickFormat(function(d) {return d/10000 + 'k'})

    chart.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${height - 50})`)
      .call(xAxis);

    chart.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(50, 5)')
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
      .attr('width', x.bandwidth() - 25)
      .transition()
        .delay((d, i) => i * 20)
        .duration(2500)
        .attr('y', d => y(d.value))
        .attr('height', d => (height - 50) - y(d.value));
  });

}

function drawHistogram() {


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
  // group for legend, on top
  const legend_g = transform_g.append('g').attr('id','legend_g');

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
      .translate(-(width / 3.5), -(height / 4)));

  // return the marker group
  return marker_g;
}

function renderLegend(valueRange) {

  const legendWidth = 10,
    legendHeight = 50,
    margin = {top: 10, bottom: 10, left: 10, right: 20};

  const legendScale = d3.scaleLinear()
    .domain([0, d3.max(valueRange)])
    .range([0, legendHeight - 1]);

  // legend axis
  const legendAxis = d3.axisRight()
    .scale(legendScale)
    .tickSize(2)
    .tickFormat(function(d) {return d/1000 + 'k'})
    .ticks(3);

  const legend_g = d3.select('#legend_g')
    .style('position', 'absolute');

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
    .attr('y', window.innerHeight / 3)
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .attr('fill', 'url(#gradient)');

  legend_g
    .append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${(window.innerWidth / 4 - 50) + 10}, ${(window.innerHeight / 3)})`)
    .call(legendAxis);

}
