
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
    
    const years = monthlyVariance.filter((data) => {
        return data.month == 1;
    }).map((data) => {
        return data.year;
    });

    const barWidth = (width - (padding * 2)) / years.length;
    const barHeight = (height - (padding * 2)) / 12;

    // Create x and y scales.
    const xScale = d3.scaleLinear()
                     .domain([d3.min(years), d3.max(years)])
                     .range([padding, width-padding]);
    
    const yScale = d3.scaleLinear()
                      .domain([1, 13])
                      .range([height-padding, padding])

    // Set x and y axis displays.
    var xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    var yAxis = d3.axisLeft(d3.scaleBand()
                              .domain([1,2,3,4,5,6,7,8,9,10,11,12])
                              .range([height-padding, padding])
                              .padding(0.01));

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
       .attr('font-size', '30px')
       .text('Global Land-Surface Temperatures (Monthly)')
    
    // Add subtitle.
    svg.append('text')
       .attr('id', 'description')
       .attr('x', width / 2)
       .attr('y', padding / 1.2)
       .attr('text-anchor', 'middle')
       .attr('font-size', '20px')
       .text('Base temperature: ' + dataset.baseTemperature + ' celsius');
    
    // Map data.
    svg.selectAll('rect')
       .data(monthlyVariance)
       .enter()
       .append('rect')
       .attr('class', 'cell')
       .attr('data-month', (d) => d.month)
       .attr('data-year', (d)=> d.year)
       .attr('data-temp', (d) => d.variance)
       .attr('x', (d) => xScale(d.year))
       .attr('y', (d) => height - yScale(d.month))
       .attr('width', (d) => barWidth)
       .attr('height', (d) => barHeight)

    // Display x and y axis.
    svg.append('g')
       .attr('id', 'x-axis')
       .attr('transform', 'translate(0,' + (height - padding) + ')')
       .call(xAxis);
    
    svg.append('g')
       .attr('id', 'y-axis')
       .attr('transform', 'translate(' + (padding) + ', 0)')
       .call(yAxis);
}