
function generateHeatMap(dataFile, plotWidth, plotHeight) {
    const margin = {top: 80, right: 25, bottom: 30, left: 100},
        width = plotWidth - margin.left - margin.right,
        height = plotHeight - margin.top - margin.bottom;

    const svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.csv(dataFile).then(function (data) {

        const myGroups = Array.from(new Set(data.map(d => d.chapter)))
        const myVars = Array.from(new Set(data.map(d => d.character)))

        const x = d3.scaleBand()
            .range([0, width])
            .domain(myGroups)
            .padding(0.05);
        svg.append("g")
            .style("font-size", 15)
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()

        const y = d3.scaleBand()
            .range([height, 0])
            .domain(myVars)
            .padding(0.05);
        svg.append("g")
            .style("font-size", 15)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        const myColor = d3.scaleSequential()
            .interpolator(d3.interpolateInferno)
            .domain([0, d3.max(data, d => +d.count)])

        const tooltip = d3.select("#my_dataviz")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        const mouseover = function (event, d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        const mousemove = function (event, d) {
            tooltip
                .html("The exact value of<br>this cell is: " + d.count)
                .style("left", (event.x) / 2 + "px")
                .style("top", (event.y) / 2 + "px")
        }
        const mouseleave = function (event, d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        svg.selectAll()
            .data(data, function (d) {
                return d.chapter + ':' + d.character;
            })
            .join("rect")
            .attr("x", function (d) {
                return x(d.chapter)
            })
            .attr("y", function (d) {
                return y(d.character)
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function (d) {
                return myColor(d.count)
            })
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
    })

    svg.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text("d3.js Heatmap");

    svg.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 400)
        .text("Character mention count in Alice in Wonderland");

}
