
async function generateD3Histogram(dataFileName, width, height) {
  // Clear any existing SVG to prevent multiple plots
  d3.select("#histogram-container").selectAll("*").remove();

  const margin = { top: 20, right: 30, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.select("#histogram-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Load the data
  const data = await d3.text(dataFileName).then(text => {
    // Split by new line, remove header, filter out empty lines, and parse as numbers
    return text.split('\n')
               .slice(1) // Remove header
               .filter(d => d.trim() !== '') // Filter out empty lines
               .map(d => parseFloat(d.trim())); // Parse as float
  });

  // Filter out any NaN values that might result from parsing errors
  const numericData = data.filter(d => !isNaN(d));

  if (numericData.length === 0) {
    console.error("No numeric data found to generate histogram.");
    svg.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight / 2)
      .attr("text-anchor", "middle")
      .text("No data to display histogram.");
    return;
  }

  // Set up the x-axis scale
  const x = d3.scaleLinear()
    .domain(d3.extent(numericData)) // Use min and max of data for domain
    .range([0, innerWidth]);

  // Set up the histogram layout
  // You might want to adjust the number of bins or use d3.thresholdFreedmanDiaconis or d3.thresholdSturges
  const histogram = d3.histogram()
    .value(d => d)
    .domain(x.domain())
    .thresholds(x.ticks(50)); // A reasonable number of bins, was 40

  const bins = histogram(numericData);

  // Set up the y-axis scale
  const y = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length)]) // Max frequency for domain
    .range([innerHeight, 0]);

  // Append the bars
  svg.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", d => x(d.x0) + 1) // Add 1 for a small gap between bars
    .attr("y", d => y(d.length))
    .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1)) // Subtract 1 for gap
    .attr("height", d => innerHeight - y(d.length))
    .attr("fill", "steelblue");

  // Add the x-axis
  svg.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).ticks(10))
    .append("text")
    .attr("x", innerWidth / 2)
    .attr("y", margin.bottom - 10)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Wing Length (mm)"); // X-axis label

  // Add the y-axis
  svg.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 20)
    .attr("x", -innerHeight / 2)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Frequency"); // Y-axis label

  // Add a title
  svg.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("text-decoration", "underline")
    .text("Histogram of Crow Wing Lengths");
}
