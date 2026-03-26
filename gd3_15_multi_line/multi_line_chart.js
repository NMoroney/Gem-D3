
function createMultiLineChart(datafile, width, height) {
    const margin = {top: 20, right: 80, bottom: 30, left: 50};
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const x = d3.scaleLinear().range([0, chartWidth]);
    const y = d3.scaleLinear().range([chartHeight, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const line = d3.line()
        .x(d => x(d.nanometers))
        .y(d => y(d.value));

    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv(datafile, (d, _, columns) => {
        for (let i = 1; i < columns.length; ++i) {
            d[columns[i]] = +d[columns[i]];
        }
        return d;
    }).then(data => {
        const valueColumns = data.columns.slice(1);

        color.domain(valueColumns);

        const lines = valueColumns.map(id => {
            return {
                id: id,
                values: data.map(d => {
                    return {nanometers: d.nanometers, value: d[id]};
                })
            };
        });

        x.domain(d3.extent(data, d => d.nanometers));
        y.domain([
            d3.min(lines, c => d3.min(c.values, d => d.value)),
            d3.max(lines, c => d3.max(c.values, d => d.value))
        ]);

        svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y))
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Value");

        const lineGroups = svg.selectAll(".line")
            .data(lines)
            .enter().append("g")
            .attr("class", "line");

        lineGroups.append("path")
            .attr("class", "line")
            .attr("d", d => line(d.values))
            .style("stroke", d => color(d.id))
            .style("fill", "none");

        lineGroups.append("text")
            .datum(d => { return {id: d.id, value: d.values[d.values.length - 1]}; })
            .attr("transform", d => "translate(" + x(d.value.nanometers) + "," + y(d.value.value) + ")")
            .attr("x", 3)
            .attr("dy", "0.35em")
            .style("font", "10px sans-serif")
            .text(d => d.id);
    }).catch(error => {
        console.error('Error loading or parsing data:', error);
    });
}
