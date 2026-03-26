
function createArrowPlot(fileName, width, height) {
    const margin = {top: 20, right: 40, bottom: 30, left: 40};
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.tsv(fileName).then(function(data) {
        data.forEach(function(d) {
            d.x1 = +d.x1;
            d.y1 = +d.y1;
            d.x2 = +d.x2;
            d.y2 = +d.y2;
        });

        const x = d3.scaleLinear()
            .domain([d3.min(data, d => Math.min(d.x1, d.x2)), d3.max(data, d => Math.max(d.x1, d.x2))])
            .range([0, plotWidth]);

        const y = d3.scaleLinear()
            .domain([d3.min(data, d => Math.min(d.y1, d.y2)), d3.max(data, d => Math.max(d.y1, d.y2))])
            .range([plotHeight, 0]);

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0,${plotHeight})`)
            .call(d3.axisBottom(x));

        // Add Y axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // Define arrow marker
        svg.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 10)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
          .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("class","arrowHead");

        // Draw arrows
        svg.selectAll(".arrow")
            .data(data)
            .enter().append("line")
            .attr("class", "arrow")
            .attr("x1", d => x(d.x1))
            .attr("y1", d => y(d.y1))
            .attr("x2", d => x(d.x2))
            .attr("y2", d => y(d.y2))
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrow)");
    });
}
