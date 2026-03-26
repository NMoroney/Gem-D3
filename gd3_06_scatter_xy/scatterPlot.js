function generateScatterPlot(inputDataFileName, plotWidth, plotHeight) {
  // Clear any existing SVG to allow for re-drawing
  d3.select("#scatterplot-container").selectAll("*").remove();

  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = plotWidth - margin.left - margin.right;
  const height = plotHeight - margin.top - margin.bottom;

  const svg = d3.select("#scatterplot-container")
    .append("svg")
    .attr("width", plotWidth)
    .attr("height", plotHeight)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.tsv(inputDataFileName).then(data => {
    // Assuming the TSV has columns named 'x' and 'y'
    // If not, adjust data.columns[0] and data.columns[1] accordingly
    const xColumn = data.columns[0];
    const yColumn = data.columns[1];

    data.forEach(d => {
      d[xColumn] = +d[xColumn];
      d[yColumn] = +d[yColumn];
    });

    // Calculate data extents
    const xMin = d3.min(data, d => d[xColumn]);
    const xMax = d3.max(data, d => d[xColumn]);
    const yMin = d3.min(data, d => d[yColumn]);
    const yMax = d3.max(data, d => d[yColumn]);

    // Determine the overall data range to maintain fixed aspect ratio
    const dataRangeX = xMax - xMin;
    const dataRangeY = yMax - yMin;

    // Use the larger of the two data ranges to set the domain for both scales
    // This ensures that the visual aspect ratio matches the data aspect ratio
    const commonDomainExtent = Math.max(dataRangeX, dataRangeY);

    // Calculate midpoints to center the common domain
    const xMid = (xMin + xMax) / 2;
    const yMid = (yMin + yMax) / 2;

    const domainMinX = xMid - commonDomainExtent / 2;
    const domainMaxX = xMid + commonDomainExtent / 2;
    const domainMinY = yMid - commonDomainExtent / 2;
    const domainMaxY = yMid + commonDomainExtent / 2;

    // Set up scales
    const xScale = d3.scaleLinear()
      .domain([domainMinX, domainMaxX])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([domainMinY, domainMaxY])
      .range([height, 0]);

    // Add X-axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Add Y-axis
    svg.append("g")
      .call(d3.axisLeft(yScale));

    // Add X-axis label
    svg.append("text")
      .attr("transform", `translate(${width / 2},${height + margin.bottom - 5})`)
      .style("text-anchor", "middle")
      .text(xColumn);

    // Add Y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yColumn);

    // Add dots
    svg.append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d[xColumn]))
      .attr("cy", d => yScale(d[yColumn]))
      .attr("r", 3)
      .style("fill", "#69b3a2");

  }).catch(error => {
    console.error("Error loading or parsing data:", error);
    d3.select("#scatterplot-container").append("p").text(`Error: Could not load data from ${inputDataFileName}. Please ensure the file exists and is correctly formatted.`);
  });
}
