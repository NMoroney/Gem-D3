// d3_boxplot.js

async function generateBoxPlot(fileName, width, height) {
    // Set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Read the data
    const data = await d3.text(fileName).then(text => {
        return text.split('\n')
                   .slice(1) // Skip the header row
                   .filter(d => d.trim() !== '') // Remove empty lines
                   .map(d => +d); // Convert to numbers
    });

    // Compute summary statistics for the data
    const sortedData = data.sort(d3.ascending);
    const q1 = d3.quantile(sortedData, 0.25);
    const median = d3.quantile(sortedData, 0.5);
    const q3 = d3.quantile(sortedData, 0.75);
    const interQuartileRange = q3 - q1;
    const min = d3.min(sortedData);
    const max = d3.max(sortedData);

    // Y axis
    const y = d3.scaleLinear()
        .domain([min - (interQuartileRange * 0.5), max + (interQuartileRange * 0.5)]) // Add some padding
        .range([chartHeight, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // A fake X axis for the box plot, as it's just one category
    const x = d3.scaleBand()
        .range([0, chartWidth])
        .domain(["Crow Wing Lengths"])
        .padding(1);
    svg.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(x));

    // Show the main vertical line
    svg.append("line")
        .attr("x1", x("Crow Wing Lengths"))
        .attr("x2", x("Crow Wing Lengths"))
        .attr("y1", y(min))
        .attr("y2", y(max))
        .attr("stroke", "black");

    // Show the box
    const boxWidth = 100;
    svg.append("rect")
        .attr("x", x("Crow Wing Lengths") - boxWidth / 2)
        .attr("y", y(q3))
        .attr("height", y(q1) - y(q3))
        .attr("width", boxWidth)
        .attr("stroke", "black")
        .attr("fill", "gray");

    // Show the median line
    svg.append("line")
        .attr("x1", x("Crow Wing Lengths") - boxWidth / 2)
        .attr("x2", x("Crow Wing Lengths") + boxWidth / 2)
        .attr("y1", y(median))
        .attr("y2", y(median))
        .attr("stroke", "black")
        .attr("stroke-width", 2);

    // Show the min and max whiskers
    svg.append("line")
        .attr("x1", x("Crow Wing Lengths") - boxWidth / 2)
        .attr("x2", x("Crow Wing Lengths") + boxWidth / 2)
        .attr("y1", y(min))
        .attr("y2", y(min))
        .attr("stroke", "black");

    svg.append("line")
        .attr("x1", x("Crow Wing Lengths") - boxWidth / 2)
        .attr("x2", x("Crow Wing Lengths") + boxWidth / 2)
        .attr("y1", y(max))
        .attr("y2", y(max))
        .attr("stroke", "black");

    // Add X-axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + margin.bottom - 5)
        .text("Crows");

    // Add Y-axis label
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 10)
        .attr("x", -margin.top - chartHeight / 2 + 50)
        .text("Length (mm)");

    // Add title
    svg.append("text")
        .attr("x", chartWidth / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("text-decoration", "underline")
        .text("Crow Wing Lengths");
}
