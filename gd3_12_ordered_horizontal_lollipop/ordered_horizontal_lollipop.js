function createLollipopChart(datafile, width, height) {
  // set the dimensions and margins of the graph
  const margin = {top: 20, right: 30, bottom: 40, left: 90};
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select("#chart")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // Parse the Data
  d3.tsv(datafile, (d) => {
    return {
      City: d.City,
      Population: +d["Population (2020)"]
    }
  }).then( (data) => {
    // Sort data
    data.sort((b, a) => a.Population - b.Population);

    // Add X axis
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Population)])
      .range([ 0, chartWidth]);
    svg.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleBand()
      .range([ 0, chartHeight ])
      .domain(data.map(d => d.City))
      .padding(1);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Lines
    svg.selectAll("myline")
      .data(data)
      .enter()
      .append("line")
        .attr("x1", d => x(d.Population))
        .attr("x2", x(0))
        .attr("y1", d => y(d.City))
        .attr("y2", d => y(d.City))
        .attr("stroke", "grey");

    // Circles
    svg.selectAll("mycircle")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", d => x(d.Population))
        .attr("cy", d => y(d.City))
        .attr("r", "4")
        .style("fill", "#69b3a2")
        .attr("stroke", "black");
  });
}
