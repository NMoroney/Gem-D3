
function drawDonutChart(data_file, width, height) {
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie()
        .value(d => d["Population (2020)"])
        .sort(null);

    const arc = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius);

    d3.tsv(data_file).then(data => {
        const path = svg.selectAll("path")
            .data(pie(data))
            .enter().append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => color(i));

        const label = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius - 80);

        svg.selectAll('text')
            .data(pie(data))
            .enter()
            .append('text')
            .attr('transform', function(d) {
                return "translate(" + label.centroid(d) + ")";
            })
            .attr('text-anchor', 'middle')
            .text(function(d) {
                return d.data.City;
            });
    });
}
