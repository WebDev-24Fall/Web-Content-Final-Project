d3.csv("../data/Population_Aged_0_to_14_Years_Percentage.csv").then(data => {
    const margin = { top: 30, right: 30, bottom: 50, left: 250 }; // Increased left margin for the legend
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#scatter-plot")
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

    // Define unique categories for colors
    const categories = [...new Set(data.map(d => d["Population, density and surface area"]))];

    // Define color scale
    const color = d3.scaleOrdinal()
        .domain(categories)
        .range(d3.schemeCategory10);

    // Scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Value) * 1.1])
        .range([height, 0]);

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
        .call(d3.axisLeft(y));

    // Tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip") // Match the CSS class
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "8px 12px")
        .style("border-radius", "4px")
        .style("pointer-events", "none");

    // Add jitter to avoid overlap
    const jitter = 5; // Adjust the jitter amount

    // Points
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.Year) + (Math.random() * jitter - jitter / 2)) // Add jitter horizontally
        .attr("cy", d => y(d.Value) + (Math.random() * jitter - jitter / 2)) // Add jitter vertically
        .attr("r", 5)
        .attr("fill", d => color(d["Population, density and surface area"]))
        .on("mouseover", (event, d) => {
            d3.select(event.target).transition().duration(200).attr("r", 7); // Increase size
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`Year: ${d.Year}<br>Value: ${d.Value}%<br>Category: ${d["Population, density and surface area"]}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 30}px`);
        })
        .on("mouseout", (event) => {
            d3.select(event.target).transition().duration(200).attr("r", 5); // Reset size
            tooltip.transition().duration(200).style("opacity", 0);
        });

    // Labels
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Year");

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .text("Percentage");

    // Legend
    const legend = svg.append("g")
        .attr("transform", `translate(-200, 0)`); // Place the legend to the left of the scatter plot

    categories.forEach((category, i) => {
        legend.append("circle")
            .attr("cx", 10)
            .attr("cy", i * 20)
            .attr("r", 6)
            .style("fill", color(category));

        legend.append("text")
            .attr("x", 20)
            .attr("y", i * 20)
            .attr("dy", "0.35em")
            .text(category)
            .style("font-size", "12px")
            .attr("alignment-baseline", "middle");
    });
});
