function init() {

    d3.csv("../../Unemployment_78-95.csv", function (d) {
        return {
            date: new Date(+d.year, +d.month - 1),
            number: +d.number
        };
    }).then(function (data) {
        dataset = data;

        linechart(dataset); 
    });
}

function linechart(dataset) {
    var w = 800;
    var h = 400;

    var margin = { top: 20, right: 30, bottom: 30, left: 80 };

    var svg = d3.select("#areaChart")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Corrected to use d3.extent for xScale domain
    var xScale = d3.scaleTime()
        .domain(d3.extent(dataset, function(d) { return d.date; }))
        .range([0, w]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function (d) { return d.number; })]) // Correct y domain
        .range([h, 0]);

    var area = d3.area()
        .x(function(d) { return xScale(d.date); })
        .y0(function() { return yScale.range()[0]; })
        .y1(function(d) { return yScale(d.number); });
    
    svg.append("path")
        .datum(dataset)
        .attr("class", "area")
        .attr("d", area)
        .style("fill", "blue")
        .style("opacity", 0.7);

    var line = d3.line()
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.number); });

    svg.append("path")
        .datum(dataset)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "black")
        .style("stroke-width", 2)
        .style("fill", "none");

    // X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(d3.axisBottom(xScale));

    // Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale));

    // Red line marking half a million
    svg.append("line")
        .attr("class", "halfMilMark")
        .attr("x1", 0)
        .attr("x2", w)
        .attr("y1", yScale(500000))
        .attr("y2", yScale(500000))
        .style("stroke", "red")
        .style("stroke-width", "2px");

    // Red label for half a million mark
    svg.append("text")
        .attr("class", "halfMilLabel")
        .attr("x", 10)
        .attr("y", yScale(500000) - 7)
        .text("Half a million unemployed")
        .style("fill", "red");
}
