d3.csv('../data/male_population_estimates.csv').then(function (data) {
    // Set the dimensions of the canvas/graph
    const margin = { top: 40, right: 150, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#stacked-bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // List of subgroups (keys of the data, here the regions)
    const subgroups = data.columns.slice(1); // Exclude the year column

    // List of all the years (categories on x-axis)
    const years = Array.from(new Set(data.map(d => d.Year)));

    // Color scale: discrete colors based on population range
    const color = d3.scaleQuantize()
        .domain([0, d3.max(data, d => d3.sum(subgroups, key => +d[key]))])
        .range(["green", "yellow", "orange", "red", "blue"]);  // Define your color range here

    // X axis: year
    const x = d3.scaleBand()
        .domain(years)
        .range([0, width])
        .padding(0.1);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "middle");

    // Y axis: population values
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.sum(subgroups, key => +d[key]))])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    // Stack the data
    const stackedData = d3.stack()
        .keys(subgroups)(data);

    // Tooltip container
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#f7f7f7")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("opacity", 0)
        .style("pointer-events", "none");

    // Create the bars
    svg.selectAll(".layer")
        .data(stackedData)
        .enter().append("g")
        .attr("class", "layer")
        .selectAll("rect")
        .data(d => d)
        .enter().append("rect")
        .attr("x", d => x(d.data.Year))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .attr("fill", d => color(d[1] - d[0]))  // Apply color based on population value
        .on("mouseover", function (event, d) {
            tooltip.transition().duration(0).style("opacity", 0);

            d3.select(this)
                .transition()
                .duration(200)
                .attr("opacity", 0.8)
                .attr("stroke", "black")
                .attr("stroke-width", 2);

            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html("Value: " + (d[1] - d[0]).toFixed(2) + " million")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mousemove", function (event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("opacity", 1)
                .attr("stroke", "none");

            tooltip.transition().duration(200).style("opacity", 0);
        });

    // Legend on the right side
    const legend = svg.append("g")
        .attr("transform", "translate(" + width + ",0)");

    // Define the population thresholds for the legend
    const legendThresholds = [0, 1000000, 5000000, 10000000, 50000000];

    // Define corresponding colors
    const legendColors = ["green", "yellow", "orange", "red", "blue"];

    legend.selectAll("rect")
        .data(legendThresholds)
        .enter().append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 30)
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", (d, i) => legendColors[i]);  // Apply color from the defined color array

    legend.selectAll("text")
        .data(legendThresholds)
        .enter().append("text")
        .attr("x", 30)
        .attr("y", (d, i) => i * 30 + 15)
        .text(d => {
            if (d === 0) return "< 1 million";
            else if (d === 1000000) return "1 million - 5 million";
            else if (d === 5000000) return "5 million - 10 million";
            else if (d === 10000000) return "10 million - 50 million";
            else return "> 50 million";
        })
        .style("font-size", "14px");

    // Title for X-axis
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom - 10) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Year");

    // Title for Y-axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Population (in millions)");
});
