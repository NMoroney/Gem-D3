// Function to plot the outline of the states in the United States of America
function plotUSStatesOutline(svgId) {
    const width = 600;
    const height = 400;

    // Select the SVG element
    const svg = d3.select(`#${svgId}`);

    // Create a path generator with Albers USA projection
    // This projection is specifically designed for the contiguous United States,
    // and shifts Alaska and Hawaii for better visual representation.
    const path = d3.geoPath();

    // Load the TopoJSON data for US states
    // This data is pre-projected using Albers USA, so we don't need to explicitly set a projection here.
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json")
        .then(us => {
            // Convert TopoJSON to GeoJSON
            // The 'states' object in the TopoJSON contains the state geometries.
            const states = topojson.feature(us, us.objects.states);

            // Draw the states
            svg.append("g")
                .attr("class", "states")
                .selectAll("path")
                .data(states.features)
                .enter().append("path")
                .attr("class", "state")
                .attr("d", path);

            // Draw the state boundaries (a separate path for outlines)
            svg.append("path")
                .attr("class", "state-boundary")
                .attr("d", path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));

            // Optionally, add a title to each state for interactivity or debugging
            // svg.selectAll(".state")
            //     .append("title")
            //     .text(d => d.properties.name);

        })
        .catch(error => {
            console.error("Error loading or processing data:", error);
        });
}

// Call the function to plot the map when the script loads
plotUSStatesOutline("us-map");
