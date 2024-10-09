var w = 500;
var h = 400;
var margin = {top: 20, right: 30, bottom: 30, left: 40};  // Added margins for better axis visibility

var svg = d3.select("body")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataset = [14, 5, 27, 23, 9, 30, 25, 27];
var numValues = dataset.length; // Define numValues for the initial dataset length

var xScale = d3.scaleBand()
    .domain(d3.range(dataset.length))
    .range([0, w])
    .paddingInner(0.05);

var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset) + 5])  // Ensures padding above the tallest bar
    .range([h, 0]);

// Drawing the bars
var bars = svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
        return xScale(i);
    })
    .attr("y", function (d) {
        return yScale(d);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function (d) {
        return h - yScale(d);
    })
    .attr("fill", "limegreen");

// X Axis
var xAxis = d3.axisBottom(xScale)
    .tickFormat(function(d, i) { return i + 1; });  // Label ticks with index + 1

svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis);

// Y Axis
var yAxis = d3.axisLeft(yScale);

svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

// Bar labels
var labels = svg.selectAll(".bar-text")
    .data(dataset)
    .enter()
    .append("text")
    .attr("class", "bar-text")
    .text(function (d) {
        return d;
    })
    .attr("fill", "black")
    .attr("x", function (d, i) {
        return xScale(i) + xScale.bandwidth() / 2;
    })
    .attr("y", function (d) {
        return yScale(d) - 5;
    })
    .attr("text-anchor", "middle");

// Button click event to update data
d3.select(".update").on("click", function () {
    // Generate new random dataset
    dataset = [];
    for (var i = 0; i < numValues; i++) {
        var newNumber = Math.floor(Math.random() * 25);
        dataset.push(newNumber);
    }

    // Update scales
    yScale.domain([0, d3.max(dataset) + 5]);

    // Update bars
    bars.data(dataset)
        .transition()
        .duration(500)
        .attr("y", function (d) {
            return yScale(d);
        })
        .attr("height", function (d) {
            return h - yScale(d);
        });

    // Update labels
    labels.data(dataset)
        .transition()
        .duration(500)
        .text(function (d) {
            return d;
        })
        .attr("y", function (d) {
            return yScale(d) - 5;
        });

        svg.select(".y-axis") // Select the existing Y-axis in the SVG
        .transition()
        .duration(500)
        .call(yAxis); // Call the yAxis again to update it
});
