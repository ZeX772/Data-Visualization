

var w = 500;
var h = 400;
var barPadding = 3;
var margin = { top: 20, right: 30, bottom: 30, left: 40 };

var dataset = [14, 5, 27, 23, 9, 30, 25, 27];
var numValues = dataset.length; // Define numValues for the initial dataset length

var svg = d3.select("body")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleBand()
    .domain(d3.range(dataset.length))
    .range([0, w])
    .paddingInner(0.05);

var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset) + 5]) // Adds 5 units of padding at the top
    .range([h, 0]);

// Initial draw for the bars
svg.selectAll("rect")
    .data(dataset)  // Use dataset here
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
        return xScale(i);  // Use i for the index
    })
    .attr("y", function (d) {
        return yScale(d);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function (d) {
        return h - yScale(d);
    })
    .attr("fill", "limegreen");

// Create X-axis
var xAxis = d3.axisBottom(xScale)
    .tickFormat(function (d, i) { return i + 1; });  // Label ticks with index + 1

// Append X-axis to the SVG
svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis);

// Create Y-axis
var yAxis = d3.axisLeft(yScale);

// Append Y-axis to the SVG
svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis);


// Button click event to update data
d3.select(".update").on("click", function () {
    // Generate new random dataset
    dataset = [];
    for (var i = 0; i < numValues; i++) {
        var newNumber = Math.floor(Math.random() * 25);  // Random number between 0 and 30
        dataset.push(newNumber);
    }

    // Update yScale to reflect new dataset
    yScale.domain([0, d3.max(dataset) + 5]); // Adds 5 units of padding at the top

    svg.selectAll("rect")
        .data(dataset)
        .transition()  // Add a transition for smooth updating
        .duration(500)
        .attr("y", function (d) {
            return yScale(d);
        })
        .attr("height", function (d) {
            return h - yScale(d);
        });
    // Update Y-axis
    svg.select(".y-axis")
        .transition()
        .duration(500)
        .call(yAxis);
});
// Button click event for first transition
d3.select("#trans1").on("click", function () {
    // Generate new random dataset
    dataset = [];
    for (var i = 0; i < numValues; i++) {
        var newNumber = Math.floor(Math.random() * 25);
        dataset.push(newNumber);
    }

    // Update yScale to reflect new dataset
    yScale.domain([0, d3.max(dataset) + 5]);

    svg.selectAll("rect")
        .data(dataset)
        .transition()
        .delay(function (d, i) {
            return i * 100;
        })
        .ease(d3.easeCircleOut)
        .duration(500)
        .attr("y", function (d) {
            return yScale(d);
        })
        .attr("height", function (d) {
            return h - yScale(d);
        });
    // Update Y-axis
    svg.select(".y-axis")
        .transition()
        .duration(500)
        .call(yAxis);
});


// Button click event for second transition
d3.select("#trans2").on("click", function () {
    // Generate new random dataset
    dataset = [];
    for (var i = 0; i < numValues; i++) {
        var newNumber = Math.floor(Math.random() * 25);
        dataset.push(newNumber);
    }

    // Update yScale to reflect new dataset
    yScale.domain([0, d3.max(dataset) + 5]);

    svg.selectAll("rect")
        .data(dataset)
        .transition()
        .delay(function (d, i) {
            return i * 100;
        })
        .ease(d3.easeElasticOut)
        .duration(2000)
        .attr("y", function (d) {
            return yScale(d);
        })
        .attr("height", function (d) {
            return h - yScale(d);
        });
    // Update Y-axis
    svg.select(".y-axis")
        .transition()
        .duration(500)
        .call(yAxis);
});