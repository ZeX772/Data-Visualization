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
    .attr("fill", "cyan")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

// Function to handle mouseover event
function handleMouseOver(event, d) {
    d3.select(this).attr("fill", "orange");
    var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
    var yPosition = parseFloat(d3.select(this).attr("y")) - 10;

    // Append a tooltip text
    svg.append("text")
        .attr("id", "tooltip")
        .attr("x", xPosition)
        .attr("y", yPosition)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .text(d);
}

// Function to handle mouseout event
function handleMouseOut() {
    d3.select(this).attr("fill", "blue");
    // Remove the tooltip when the mouse leaves
    d3.select("#tooltip").remove();
}

// Create X-axis
var xAxis = d3.axisBottom(xScale)
    .tickFormat(function (d, i) { return i + 1; });  // Label ticks with index + 1

// Append X-axis to the SVG
var xAxisGroup = svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis);

// Create Y-axis
var yAxis = d3.axisLeft(yScale);

// Append Y-axis to the SVG
var yAxisGroup = svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

// Button click event to update and add new data
d3.select("#add").on("click", function () {
    // Generate new random dataset
    dataset.push(Math.floor(Math.random() * 25)); // Add a new random value to the dataset

    numValues = dataset.length; // Update the number of values

    // Update the X Scale domain
    xScale.domain(d3.range(numValues));

    // Update yScale to reflect new dataset
    yScale.domain([0, d3.max(dataset) + 5]); // Adds 5 units of padding at the top

    // Update the X Axis with transition
    xAxisGroup.transition()
        .duration(500)
        .call(xAxis);

    // Update the Y Axis with transition
    yAxisGroup.transition()
        .duration(500)
        .call(yAxis);

    // Bind the new data to the bars
    var bars = svg.selectAll("rect")
        .data(dataset);

    // ENTER + UPDATE pattern
    bars.enter()
        .append("rect")
        .merge(bars)
        .transition()
        .duration(500)
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
        .attr("fill", "cyan");

    // Re-apply the hover events
    svg.selectAll("rect")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);
});

// Remove Button Click Event
d3.select("#remove").on("click", function () {
    if (dataset.length === 0) {
        alert("Dataset is empty. Cannot remove any more bars.");
        return;
    }

    // Remove the last element from the dataset
    dataset.pop();

    numValues = dataset.length; // Update the number of values

    // Update the X Scale domain
    xScale.domain(d3.range(numValues));

    // Update yScale to reflect new dataset
    yScale.domain([0, d3.max(dataset) || 1]); // Prevent domain max from being undefined

    // Update the X Axis with transition
    xAxisGroup.transition()
        .duration(500)
        .call(xAxis);

    // Re-bind the updated dataset to the bars
    var bars = svg.selectAll("rect")
        .data(dataset);

    // EXIT: Remove the bars that are no longer needed
    bars.exit()
        .transition()
        .duration(500)
        .attr("y", yScale(0))
        .attr("height", 0)
        .remove();

    // UPDATE: Update existing bars' positions and sizes
    bars.transition()
        .duration(500)
        .attr("x", function (d, i) {
            return xScale(i);
        })
        .attr("y", function (d) {
            return yScale(d);
        })
        .attr("height", function (d) {
            return h - yScale(d);
        })
        .attr("width", xScale.bandwidth());

    // Re-apply the hover events
    svg.selectAll("rect")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);
});
var ascending = true;

d3.select("#sort").on("click", function() {
    // Toggle sorting order
    ascending = !ascending;

    // Sort the bars visually based on the data
    svg.selectAll("rect")
        .sort(function(a, b) {
            return ascending ? d3.ascending(a, b) : d3.descending(a, b);
        })
        .transition()  // Add transition to animate the sorting
        .duration(500)
        .attr("x", function(d, i) {
            return xScale(i);  // Reassign the x-position after sorting
        });
});

