d3.csv("../data/Population_Aged_0_to_14_Years_Percentage.csv").then(data => {
    // Parse the data
    data = data.map(d => ({
        category: d["Population, density and surface area"],
        value: +d.Value
    }));

    const width = 800;
    const height = 600;
    const margin = 50;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select("#pie-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Define color scale
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.category))
        .range(d3.schemeCategory10);

    // Create pie and arc generators
    const pie = d3.pie()
        .sort(null) // Keep order as in the data
        .value(d => d.value);

    const arc = d3.arc()
        .innerRadius(0) // Full pie (no donut)
        .outerRadius(radius);

    const hoverArc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius + 10); // Slightly larger on hover

    // Tooltip for pie chart
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip-pie") // Unique class for pie chart tooltip
        .style("opacity", 0);

    // Draw pie chart
    svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.category))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .on("mouseover", function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("d", hoverArc);

            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`Category: <strong>${d.data.category}</strong><br>Value: ${d.data.value}%`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 30}px`);
        })
        .on("mousemove", function (event) {
            tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY - 30}px`);
        })
        .on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("d", arc);

            tooltip.transition().duration(200).style("opacity", 0);
        });

    // Filter unique categories for legend
    const uniqueCategories = Array.from(new Set(data.map(d => d.category)));

    // Multi-column Legend
    const legend = d3.select("#pie-chart")
        .append("div")
        .attr("class", "legend")
        .style("display", "grid")
        .style("grid-template-columns", "repeat(auto-fit, minmax(150px, 1fr))")
        .style("gap", "15px")
        .style("margin-top", "20px");

    uniqueCategories.forEach(category => {
        const legendItem = legend.append("div")
            .style("display", "flex")
            .style("align-items", "center");

        legendItem.append("div")
            .style("width", "15px")
            .style("height", "15px")
            .style("margin-right", "10px")
            .style("background-color", color(category))
            .style("border", "1px solid #ccc");

        legendItem.append("span")
            .text(category)
            .style("font-size", "14px")
            .style("color", "#333");
    });
});
