var d3 = require('d3');
var topojson = require('topojson-client');

window.init = function() {

  // Draw Map which will sit behind the points.
  const g = drawMap();

  // set markers - pass in period
  setMarkers(g, 'all');
}

function setMarkers(g, period) {

  const margin = {top: 50, right: 20, bottom: 50, left: 100},
    width = parseInt(d3.select('#map').style('width')) - margin.left - margin.right,
    height = parseInt(d3.select('#map').style('height')) - margin.top - margin.bottom;

  const projection = d3.geoMercator()
    .center([-73.94, 40.70])
    .scale(50000)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath()
    .projection(projection);

  // Draw points
  switch (period) {
    case 'all':
      d3.json('/data/stations_all_topo', function (error, topo) {

        g.selectAll('.points')
          .data(topojson.feature(topo, topo.objects.stations).features)
          .enter()
          .append('path')
          .attr('class', 'points')
          .attr('d', path.pointRadius(2));


        defaultBarChart();
      });
  }
}

function defaultBarChart() {

  d3.csv('/data/stations_all', function (data) {

    const yearRideCount = d3.nest()
      .key(d => d.ride_year)
      .rollup(d => parseInt(d3.sum(d, leaf => leaf.total_rides)))
      .entries(data);

    yearRideCount[0].num_stations = 1000;

    const margin = {top: 50, right: 20, bottom: 50, left: 100},
      width = parseInt(d3.select('#chart').style('width')) - margin.left - margin.right,
      height = parseInt(d3.select('#chart').style('height')) - margin.top - margin.bottom;


    const chart = d3.select('#chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('transform', 'translate(' + window.innerWidth / 2 + ',' + margin.top + ')');

    const x = d3.scaleBand()
      .domain(yearRideCount.map(d => d.key))
      .rangeRound([50, width - 50])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(yearRideCount, d => d.value)])
      .range([height - 50, 0]);

    const xAxis = d3.axisBottom().scale(x);
    const yAxis = d3.axisLeft().scale(y).tickFormat(function(d) {return d/10000 + 'K'});

    chart.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${height - 50})`)
      .call(xAxis);

    chart.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(50, 0)')
      .call(yAxis);

    chart.selectAll('rect')
      .data(yearRideCount)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.key))
      .attr('y', d => height - 50)
      .attr('width', x.bandwidth())
      .transition()
        .delay((d, i) => i * 20)
        .duration(800)
        .attr('y', d => y(d.value))
        .attr('height', d => (height - 50) - y(d.value));
  });

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
    .scale(50000)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath()
    .projection(projection);

  const zoom = d3.zoom()
    .scaleExtent([1/4, 7])
    .on('zoom', function () {
      d3.select('g').attr('transform', d3.event.transform)
    });

  const svg = d3.select('#map')
    .attr('width', width)
    .attr('height', height)
    .call(zoom);

  // Return svg group to be used for markers
  const g = svg.append('g');

  d3.json('/data/nyc-zip-polys', function(error, topo) {

    g.selectAll('.zips')
      .data(topojson.feature(topo, topo.objects.nyc).features)
      .enter()
      .append('path')
      .attr('class', 'zips')
      .attr('d', path);
  });

  return g;
}
