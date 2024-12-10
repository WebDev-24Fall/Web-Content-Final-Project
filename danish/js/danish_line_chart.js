d3.csv('../data/male_population_estimates.csv').then(function (data) {
    console.log('Raw data:', data);

    // Filter and clean the dataset
    data = data.filter(function (d) {
        if (d.Value) {
            d.Value = d.Value.replace(/,/g, ''); // Remove commas
        }

        if (
            d.Year === undefined || 
            d.Value === undefined || 
            isNaN(+d.Year) || 
            isNaN(+d.Value)
        ) {
            console.warn('Invalid data found and excluded:', d);
            return false; // Exclude invalid rows
        }

        return d.Year >= 2008 && d.Year <= 2024;
    });

    // Convert strings to numbers
    data.forEach(function (d) {
        d.Year = +d.Year;
        d.Value = +d.Value;
    });

    console.log('Filtered and validated data:', data);

    // Ensure there are valid data points
    if (data.length === 0) {
        console.error('No valid data available for the specified range (2008-2024).');
        return;
    }

    // Chart dimensions
    var margin = { top: 20, right: 100, bottom: 60, left: 60 };
    var width = 800 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    // Create SVG
    var svg = d3
        .select('#line-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Scales
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return d.Year; }))
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.Value; })])
        .range([height, 0]);

    // Axes
    var xAxis = svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x).tickFormat(d3.format('d')));

    var yAxis = svg.append('g')
        .call(d3.axisLeft(y));

    // Axis titles
    xAxis.append("text")
        .attr("class", "axis-title")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Year"); // X-axis title

    yAxis.append("text")
        .attr("class", "axis-title")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Population Value"); // Y-axis title

    // Tooltip
    var tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background', '#fff')
        .style('border', '1px solid #ccc')
        .style('padding', '5px')
        .style('border-radius', '5px')
        .style('box-shadow', '0px 2px 5px rgba(0, 0, 0, 0.3)')
        .style('display', 'none');

    // Line generator
    var line = d3.line()
        .x(function (d) { return x(d.Year); })
        .y(function (d) { return y(d.Value); });

    // Append line
    svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line)
        .style('fill', 'none')
        .style('stroke', 'steelblue')
        .style('stroke-width', 2);

    // Add hover effects
    svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', function (d) { return x(d.Year); })
        .attr('cy', function (d) { return y(d.Value); })
        .attr('r', 4)
        .style('fill', 'steelblue')
        .on('mouseover', function (event, d) {
            tooltip.style('display', 'block');
            tooltip.html(
                '<strong>Details:</strong><br>' +
                'Year: ' + d.Year + '<br>' +
                'Value: ' + d.Value
            )
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 20) + 'px');
        })
        .on('mousemove', function (event, d) {
            tooltip.style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 20) + 'px');
        })
        .on('mouseout', function () {
            tooltip.style('display', 'none');
        });

    console.log('Chart drawn successfully');
}).catch(function (error) {
    console.error('Error loading or processing data:', error);
});
