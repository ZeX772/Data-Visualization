


function init() {
    console.log("MapChart Initialized");

    var w = 800; // Dynamic width
    var h = 500; // Dynamic height

    // Define a projection method (Mercator projection centered on coordinates)
    var projection = d3.geoMercator()
                       .scale(4000)
                       .center([145.5, -37.5]) 
                       .translate([w / 2, h / 2]); 

    // Define path generator using the projection
    var path = d3.geoPath().projection(projection);

    // Append an SVG element to the DOM
    var svg = d3.select("#mapchart")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .style("background-color", "#f0f0f0"); // Improved background styling

    // Define a color scale for better visualization
    var color = d3.scaleSequential(d3.interpolateGreys)
                  .domain([0, 10, 30]); // Adjust domain based on your data


    // Load the CSV file using promises (d3.v7 syntax)
    d3.csv("../../VIC_LGA_unemployment.csv").then(function(data) {

        // Log the data to ensure it is loaded correctly
        console.log("Loaded data:", data);

        // Convert 'unemployed' to numeric if needed
        $.each(data, function(index, d) {
            if (d.unemployed) {
                d.unemployed = +d.unemployed; // Convert 'unemployed' to number
            } else {
                console.error("Missing 'unemployed' field in row:", d);
            }
        });

        // Check the 'unemployed' values to confirm correct conversion
        console.log("Processed 'unemployed' values:", data.map(d => d.unemployed));

        // Get the minimum and maximum 'unemployed' values for the domain
        var minUnemployed = d3.min(data, function(d) { return d.unemployed; });
        var maxUnemployed = d3.max(data, function(d) { return d.unemployed; });

        if (isNaN(minUnemployed) || isNaN(maxUnemployed)) {
            console.error("Invalid 'unemployed' data, unable to calculate min/max.");
            return;
        }

        // // Define the color scale based on the actual data range
        // var color = d3.scaleSequential(d3.interpolateBlues)
        //             .domain([minUnemployed, maxUnemployed]);

        // Example usage of the color scale using jQuery's $.each
        $.each(data, function(index, d) {
            console.log(`Color for ${d.unemployed}: `, color(d.unemployed));
        });

    }).catch(function(error) {
        // Handle any errors that occur during file loading
        console.error("Error loading the CSV file:", error);
    });

    // Load GeoJSON data
    d3.json("../../LGA_VIC.json").then(function(json) {
        // Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "#333") // Improved stroke for boundaries
            .attr("fill", function(d, i) {
                return color(i % 10); // Fill with color based on index or property
            })
            .on("mouseover", function(event, d) {
                d3.select(this)
                  .attr("fill", "#ffcc00"); // Highlight on hover
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                  .attr("fill", function(d, i) {
                      return color(i % 10); // Reset color on mouse out
                  });
            });

    }).catch(function(error) {
        console.error("Error loading the GeoJSON data: ", error); // Error handling
    });

        // Load the city data and add circles for towns and cities
        d3.csv("../../VIC_city.csv").then(function(cityData) {
            // Add circles for each city/town
            svg.selectAll("circle")
                .data(cityData)
                .enter()
                .append("circle")
                .attr("cx", function(d) {
                    return projection([+d.lon, +d.lat])[0]; // Map longitude to x using projection
                })
                .attr("cy", function(d) {
                    return projection([+d.lon, +d.lat])[1]; // Map latitude to y using projection
                })
                .attr("r", 5) // Radius of the circle
                .attr("fill", "red") // Color of the circle
                .attr("stroke", "black") // Circle border color
                .attr("stroke-width", 1.5)
                .attr("opacity", 0.7) // Opacity for better visibility
                .on("mouseover", function(event, d) {
                    d3.select(this)
                      .attr("r", 7) // Increase radius on hover
                      .attr("opacity", 1); // Fully opaque on hover
                })
                .on("mouseout", function(event, d) {
                    d3.select(this)
                      .attr("r", 5) // Reset radius
                      .attr("opacity", 0.7); // Reset opacity
                })
                .append("title") // Tooltip for city names
                .text(function(d) {
                    return d.place; // Display city/town name
                });
        }).catch(function(error) {
            console.error("Error loading the city data:", error);
        });
}