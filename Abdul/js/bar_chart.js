d3.csv("../data/Population_aged_60+_years_old.csv").then(data => {
    // Parse the data
    data = data.map(d => ({
        category: d["Population, density and surface area"],
        value: +d.Value
    }));

    const width = 800;
    const height = 600;
    const margin = { top: 40, right: 40, bottom: 100, left: 60 };

    // Set up the SVG element
    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Define scales for the axes
    const x = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Add the bars
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.category))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.bottom - y(d.value))
        .attr("fill", d => d3.schemeCategory10[data.indexOf(d) % 10]);

    // Add the x-axis
    svg.append("g")
        .selectAll(".x-axis")
        .data([0])
        .enter()
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .style("transform", "rotate(-45deg)")
        .style("transform-origin", "center center");

    // Add the y-axis
    svg.append("g")
        .selectAll(".y-axis")
        .data([0])
        .enter()
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y))
        .style("font-size", "12px");

    // Tooltip for bar chart
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip-bar")
        .style("opacity", 0);

    // Add hover effects and tooltip
    svg.selectAll(".bar")
        .on("mouseover", function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "orange"); // Change color on hover

            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`Category: <strong>${d.category}</strong><br>Value: ${d.value}%`)
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
                .attr("fill", d => d3.schemeCategory10[data.indexOf(d) % 10]); // Reset color

            tooltip.transition().duration(200).style("opacity", 0);
        });

    // Filter unique categories for legend
    const uniqueCategories = Array.from(new Set(data.map(d => d.category)));

    // Multi-column Legend
    const legend = d3.select("#bar-chart")
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
            .style("background-color", d3.schemeCategory10[uniqueCategories.indexOf(category) % 10])
            .style("border", "1px solid #ccc");

        legendItem.append("span")
            .text(category)
            .style("font-size", "14px")
            .style("color", "#333");
    });
});
