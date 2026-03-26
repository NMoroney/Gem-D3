
function createTidyTree(fileName, plotWidth, plotHeight) {
    d3.csv(fileName).then(function(data) {
        const stratify = d3.stratify()
            .id(d => d.id)
            .parentId(d => d.id.substring(0, d.id.lastIndexOf('.')))
            (data);

        const root = d3.hierarchy(stratify, d => d.children);

        const width = plotWidth;
        const height = plotHeight;

        const tree = d3.tree().size([height-50, width-50]);  // N8 : fit rightmost text better

        tree(root);

        const svg = d3.select("body").append("svg")
            .attr("width", width + 50)
            .attr("height", height + 50)
            .append("g")
            .attr("transform", "translate(30, 30)");

        const link = svg.selectAll(".link")
            .data(root.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", d => {
                return "M" + d.y + "," + d.x
                    + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                    + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                    + " " + d.parent.y + "," + d.parent.x;
            });

        const node = svg.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

        node.append("circle")
            .attr("r", 5);

        node.append("text")
            .attr("dy", 3)
            .attr("x", d => d.children ? -8 : 8)
            .style("text-anchor", d => d.children ? "end" : "start")
            .text(d => d.data.id.substring(d.data.id.lastIndexOf('.') + 1));
    });
}
