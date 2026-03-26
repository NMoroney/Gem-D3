// vertical_bar_plot.js

function createVerticalBarPlot(fileName, width, height) {
    const margin = { top: 20, right: 30, bottom: 60, left: 90 }; // Increased left margin for y-axis label
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Remove any existing SVG to prevent duplicates when called multiple times
    d3.select("#chart-container").select("svg").remove();

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.tsv(fileName).then(data => {
        // Parse data
        data.forEach(d => {
            d["Area (km2)"] = +d["Area (km2)"]; // Convert area to number
        });

        // Sort data by Area (km2) in descending order to make the plot more readable
        data.sort((a, b) => b["Area (km2)"] - a["Area (km2)"]);

        // X scale for cities (band scale)
        const xScale = d3.scaleBand()
            .domain(data.map(d => d["US City"]))
            .range([0, chartWidth])
            .padding(0.1);

        // Y scale for areas (linear scale)
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d["Area (km2)"])])
            .range([chartHeight, 0]);

        // Draw bars
        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d["US City"]))
            .attr("y", d => yScale(d["Area (km2)"]))
            .attr("width", xScale.bandwidth())
            .attr("height", d => chartHeight - yScale(d["Area (km2)"]))
            .attr("fill", "steelblue");

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0,${chartHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em");

        // Add Y axis
        svg.append("g")
            .call(d3.axisLeft(yScale));

        // Add X axis label
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", chartWidth / 2 + margin.right)
            .attr("y", chartHeight + margin.bottom - 10)
            .text("US City");

        // Add Y axis label
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -margin.left + 20)
            .attr("x", -chartHeight / 2)
            .attr("transform", "rotate(-90)")
            .text("Area (km2)");

    }).catch(error => {
        console.error("Error loading or parsing data:", error);
    });
}
