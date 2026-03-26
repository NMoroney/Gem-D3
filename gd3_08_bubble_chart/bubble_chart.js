function createBubbleChart(fileName, width, height) {
    const margin = { top: 20, right: 20, bottom: 50, left: 70 };

    const svg = d3.select("#bubble-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.tsv(fileName, (d) => {
        return {
            Name: d.Name,
            Longitude: +d.Longitude,
            Latitude: +d.Latitude,
            Population: +d["Population (2020)"]
        };
    }).then((data) => {
        const xDomain = d3.extent(data, d => d.Longitude);
        const yDomain = d3.extent(data, d => d.Latitude);
        const popDomain = d3.extent(data, d => d.Population);

        const dataWidth = xDomain[1] - xDomain[0];
        const dataHeight = yDomain[1] - yDomain[0];

        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;

        const dataAspectRatio = dataWidth / dataHeight;
        const plotAspectRatio = plotWidth / plotHeight;

        let xRange, yRange;

        if (dataAspectRatio > plotAspectRatio) {
            xRange = [0, plotWidth];
            const newPlotHeight = plotWidth / dataAspectRatio;
            const yOffset = (plotHeight - newPlotHeight) / 2;
            yRange = [newPlotHeight + yOffset, yOffset];
        } else {
            yRange = [plotHeight, 0];
            const newPlotWidth = plotHeight * dataAspectRatio;
            const xOffset = (plotWidth - newPlotWidth) / 2;
            xRange = [xOffset, newPlotWidth + xOffset];
        }


        const xScale = d3.scaleLinear()
            .domain(xDomain)
            .range(xRange);

        const yScale = d3.scaleLinear()
            .domain(yDomain)
            .range(yRange);

        const radiusScale = d3.scaleSqrt()
            .domain(popDomain)
            .range([5, 50]);

        svg.append("g")
            .attr("transform", `translate(0,${plotHeight})`)
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("y", 40)
            .attr("x", plotWidth / 2)
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .text("Longitude");


        svg.append("g")
            .call(d3.axisLeft(yScale))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", -plotHeight/2)
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .text("Latitude");

        svg.selectAll(".bubble")
            .data(data)
            .enter().append("circle")
            .attr("class", "bubble")
            .attr("cx", d => xScale(d.Longitude))
            .attr("cy", d => yScale(d.Latitude))
            .attr("r", d => radiusScale(d.Population))
            .style("fill", "steelblue")
            .style("opacity", 0.7)
            .on("mouseover", (event, d) => {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d.Name)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", (d) => {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    });
}
