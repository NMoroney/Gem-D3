function drawBarChart(fileName, width, height) {
    const margin = {top: 20, right: 30, bottom: 40, left: 150};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.tsv(fileName).then(data => {
        data.forEach(d => {
            d["Population (2020)"] = +d["Population (2020)"];
        });

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d["Population (2020)"])])
            .range([0, innerWidth]);

        const y = d3.scaleBand()
            .domain(data.map(d => d.City))
            .range([0, innerHeight])
            .padding(0.1);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("y", d => y(d.City))
            .attr("height", y.bandwidth())
            .attr("x", 0)
            .attr("width", d => x(d["Population (2020)"]));
    });
}
