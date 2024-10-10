function init() {

    var w = 800;
    var h = 400;

    var margin = { top: 20, right: 30, bottom: 30, left: 80 };

    var outerRadius = Math.min(w, h) / 2; // Ensure the outer radius fits within the dimensions
    var innerRadius = 0;

    var arc = d3.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius);

    var pie = d3.pie();

    var dataset = [10, 20, 30, 40];

    var color = d3.scaleOrdinal(d3.schemeCategory10); 

    var svg = d3.select("#scatterplot")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")"); 

    var arcs = svg.selectAll("g.arc")
        .data(pie(dataset))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("fill", function (d, i) {
            return color(i);
        })
        .attr("d", arc);

    arcs.append("text")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d.value;
        });
}
