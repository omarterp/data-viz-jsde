var d3 = require('d3');
var topojson = require('topojson-client');
var d3scaleChromatic = require('d3-scale-chromatic');

var COLOR_SCHEME = d3.scaleSequential(d3scaleChromatic.interpolateBlues);

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
      d3.json('/data/stations_all_topo', function (error, topo) {

        // Derive scale for points styling
        const topoFeatures = topojson.feature(topo, topo.objects.stations).features;

        let totalRides = [];
        // Aggregate Scale Values
        topoFeatures.forEach(function(element) {
          totalRides.push(element.properties.total_rides);
        });

        // const colorScale = d3.scaleSequential(COLOR_SCHEME)
        //   .domain([0, d3.max(totalRides)]);

        const colorScale = d3.scaleLinear()
          .domain([0, d3.max(totalRides)])
          .range(['#eff3ff', '#3182bd', '#08519c'])

        renderLegend(marker_g, totalRides);

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
                'total rides : ' + d.properties.total_rides
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

    yearRideCount[0].num_stations = 1000;

    const margin = {top: 50, right: 20, bottom: 50, left: 50},
      width = parseInt(d3.select('#chart').style('width')) - margin.left - margin.right,
      height = parseInt(d3.select('#chart').style('height'));


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
    const yAxis = d3.axisLeft().scale(y).tickFormat(function(d) {return d/10000 + 'K'})

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
      .attr('y', 60)
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

function renderLegend(marker_g, valueRange) {

  // const colorScale = d3.scaleSequential(COLOR_SCHEME)
  //   .domain([0, d3.max(valueRange, function(d) { return d.count; })]);

  const colorScale = d3.scaleLinear()
    .domain([0, d3.max(valueRange)])
    .range(['#bdd7e7', '#6baed6', '#3182bd', '#08519c'])

  //console.log(colorScale.ticks(6).slice(1).reverse())

  const legend = d3.select('#legend_g')
    .data(colorScale.ticks(6).slice(1).reverse())
    .enter()
    .append('rect')
    .attr('height', 100 / 6)
    .attr('width', 10)
    .attr('class', 'legend')
    .attr('x', window.innerWidth / 4 - 50)
    .attr('y', window.innerHeight / 3);

  // marker_g.selectAll('rect')
  //   .data(colorScale.ticks(6).slice(1).reverse())
  //   .enter()
  // marker_g.selectAll('rect')
  //   .data(colorScale.ticks(6).slice(1).reverse())
  //   .enter()
  //   .append('rect')
  //   .attr('width', 20)
  //   .attr('height', 20)
  //   .attr('x', window.innerWidth / 4 - 50)
  //   .attr('y', window.innerHeight / 3 + 50)
  //   .style('fill', colorScale);

  legend.append('text')
    .attr('class', 'label')
    .attr('x', window.innerWidth / 4 - 50)
    .attr('y', window.innerHeight / 3)
    .attr('dy', '.25em')
    .text('Total Rides');
}
