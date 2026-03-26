function generateKdePlot(dataFileName, width, height) {
    // Set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 30, left: 50 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Read the data
    d3.csv(dataFileName).then(function(data) {
        // Convert string to number for the 'length' column
        const lengths = data.map(d => +d.length);

        // Add X axis
        const x = d3.scaleLinear()
            .domain([d3.min(lengths) * 0.9, d3.max(lengths) * 1.1]) // Add some padding to the domain
            .range([0, plotWidth]);
        svg.append("g")
            .attr("transform", `translate(0, ${plotHeight})`)
            .call(d3.axisBottom(x));

        // Compute kernel density estimation
        // You might need to adjust the bandwidth based on your data
        const kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(100));
        const density = kde(lengths);

        // Add Y axis
        // Find the maximum density value to set the y-domain
        const maxY = d3.max(density, d => d[1]);
        const y = d3.scaleLinear()
            .domain([0, maxY])
            .range([plotHeight, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Plot the area
        svg.append("path")
            .attr("class", "mypath")
            .datum(density)
            .attr("fill", "#69b3a2")
            .attr("opacity", 0.8)
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("linejoin", "round")
            .attr("d", d3.line()
                .curve(d3.curveBasis)
                .x(function(d) { return x(d[0]); })
                .y(function(d) { return y(d[1]); })
            );

    }).catch(function(error) {
        console.error("Error loading or processing data:", error);
    });

    // Function to compute kernel density estimation
    function kernelDensityEstimator(kernel, X) {
        return function(V) {
            return X.map(function(x) {
                return [x, d3.mean(V, function(v) { return kernel(x - v); })];
            });
        };
    }

    function kernelEpanechnikov(k) {
        return function(v) {
            return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
        };
    }
}
