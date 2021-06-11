
// Make API call.
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json', true);
xhr.send();
xhr.onload = () => {
    const json = JSON.parse(xhr.responseText);
    const dataset = json;
    heatMap(dataset);
}

function heatMap(dataset) {
    console.log(dataset);
    // SVG constants.
    const height = 400;
    const width = 800;
    const padding = 60;

    const monthlyVariance = dataset.monthlyVariance;
    const monthNames = [
        "January", "February", "March", "April", "May","June","July",
        "August", "September", "October", "November","December"
    ]
    
    const years = monthlyVariance.filter((data) => {
        return data.month == 1;
    }).map((data) => {
        return data.year;
    });

    const barWidth = (width - (padding * 2)) / years.length;
    const barHeight = (height - (padding * 2)) / 12;

    const temperatures = monthlyVariance.map((data) => data.variance);

    // Create x and y scales.
    const xScale = d3.scaleLinear()
                     .domain([d3.min(years), d3.max(years)])
                     .range([padding, width-padding]);
    
    const yScale = d3.scaleBand()
                      .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
                      .range([padding, height-padding,])
                      .padding(0.01);

    // Set x and y axis displays.
    var xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    var yAxis = d3.axisLeft(yScale)
                  .tickValues(yScale.domain())
                  .tickFormat((month) => {
                      return monthNames[month-1];
                  });
    
    // Create color Scale.
    const colorScale = d3.scaleLinear()
                         .domain([d3.min(temperatures), d3.mean(temperatures), d3.max(temperatures)])
                         .range(['blue', 'orange', 'red'])
    
    // Tooltip.
    const tooltip = d3.select('.visContainer')
                      .append('div')
                      .attr('id', 'tooltip')
                      .style('opacity', 0)
                      .attr('data-year', 2021);

    // Create and append SVG.
    const svg = d3.select('.visContainer')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);
    
    // Add title.
    svg.append('text')
       .attr('id', 'title')
       .attr('x', width / 2)
       .attr('y', padding / 2)
       .attr('text-anchor', 'middle')
       .attr('font-size', '25px')
       .text('Global Land-Surface Temperatures (Monthly)')
    
    // Add subtitle.
    svg.append('text')
       .attr('id', 'description')
       .attr('x', width / 2)
       .attr('y', padding / 1.2)
       .attr('text-anchor', 'middle')
       .attr('font-size', '15px')
       .text('Base temperature: ' + dataset.baseTemperature + ' celsius');
    
    // Map data.
    svg.selectAll('rect')
       .data(monthlyVariance)
       .enter()
       .append('rect')
       .attr('class', 'cell')
       .attr('data-month', (d) => d.month - 1)
       .attr('data-year', (d)=> d.year)
       .attr('data-temp', (d) => d.variance)
       .attr('x', (d) => xScale(d.year))
       .attr('y', (d) => yScale(d.month))
       .attr('width', (d) => barWidth)
       .attr('height', (d) => barHeight)
       .style('fill', (d) => colorScale(d.variance))
       .on('mouseover', (event, data) => {
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip
                .html(
                    'Year: ' + data.year + '<br>' + 
                    'Month: ' + data.month + '<br>' +
                    'Temperature: ' + data.variance 
                )
                .attr('data-year', data.year)
                .style('left', (event.pageX) + 'px')
                .style('top', (event.pageY) + 'px')
       })
       .on('mouseout', () => {
           tooltip.transition().duration(200).style('opacity', 0);
       });

    // Display x and y axis.
    svg.append('g')
       .attr('id', 'x-axis')
       .attr('transform', 'translate(0,' + (height - padding) + ')')
       .call(xAxis);
    
    svg.append('g')
       .attr('id', 'y-axis')
       .attr('transform', 'translate(' + (padding) + ', 0)')
       .call(yAxis);
    
    // Legend.
    const keys = [-5, -2.5, 0, 2.5, 5];
    
    const legendContainer = svg.append('g').attr('id', 'legend');
    legendContainer.selectAll('rect')
                   .data(keys)
                   .enter()
                   .append('rect')
                   .attr('x', (d, i) => i * 100 + padding * 2)
                   .attr('y', height - padding / 2)
                   .attr('width', 100)
                   .attr('height', 10)
                   .style('fill', (d) => colorScale(d));
    
    const legendXAxisScale = d3.scaleLinear()
                               .domain([-5, 5])
                               .range([padding * 2, padding * 2 + 500]);
    const legendXAxis = d3.axisBottom(legendXAxisScale);

    legendContainer.append('g')
                   .attr(
                    'transform', 
                    'translate(0' + 
                    ', ' + (height - padding / 2 + 10) +
                    ')'
                   )
                   .call(legendXAxis);
}