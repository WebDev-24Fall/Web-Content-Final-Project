d3.csv("../data/Population_aged_60+_years_old.csv").then(data => {
    const margin = { top: 30, right: 210, bottom: 50, left: 60 }; // Increased right margin for legend space
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the data
    data.forEach(d => {
        d.Year = +d.Year;
        d.Value = +d.Value;
    });

    // Define color scale for lines (if there are multiple categories)
    const categories = [...new Set(data.map(d => d["Population, density and surface area"]))];

    const color = d3.scaleOrdinal()
        .domain(categories)
        .range(d3.schemeCategory10);

    // Scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Value) * 1.1])
        .nice()
        .range([height, 0]);

    // Create the line generator
    const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d.Value));

    // Group data by category
    const nestedData = d3.groups(data, d => d["Population, density and surface area"]);

    // Create a line for each category
    nestedData.forEach(([category, categoryData]) => {
        svg.append("path")
            .data([categoryData])
            .attr("class", "line")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", color(category))
            .attr("stroke-width", 2);
    });

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d"))); // Format year as integer

    svg.append("g")
        .call(d3.axisLeft(y));

    // Tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "8px 12px")
        .style("border-radius", "4px")
        .style("pointer-events", "none");

    // Add circles to the line path for data points
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.Year))
        .attr("cy", d => y(d.Value))
        .attr("r", 4)
        .attr("fill", d => color(d["Population, density and surface area"]))
        .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`Year: ${d.Year}<br>Value: ${d.Value}%<br>Category: ${d["Population, density and surface area"]}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 30}px`);
        })
        .on("mouseout", () => {
            tooltip.transition().duration(200).style("opacity", 0);
        });

    // Labels
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Year");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .text("Percentage");

    // Legend (Place below the chart or on the right, depending on your preference)
    const legend = svg.append("g")
        .attr("transform", `translate(${width + 30}, 30)`); // Move legend further down and to the right

    categories.forEach((category, i) => {
        legend.append("circle")
            .attr("cx", 0)
            .attr("cy", i * 20)
            .attr("r", 6)
            .style("fill", color(category));

        legend.append("text")
            .attr("x", 15) // Make sure text is aligned with the circle
            .attr("y", i * 20)
            .attr("dy", "0.35em")
            .text(category)
            .style("font-size", "12px")
            .attr("alignment-baseline", "middle");
    });
});
