function init() {

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
                .style("background-color", "#f0f0f0");

    // Load unemployment data from CSV
    d3.csv("../../VIC_LGA_unemployment.csv").then(data => {
        // Define a color scale using d3's interpolateGreys for unemployment data
        const color = d3.scaleSequential(d3.interpolateGreys)
            .domain([0, 10000]); // Adjust according to your data range

        // Load LGA (Local Government Areas) geojson data
        d3.json('../../LGA_VIC.json').then(json => {
            // Loop through each LGA in the unemployment data
            data.forEach(unemploymentData => {
                const dataState = unemploymentData.LGA;
                const dataValue = parseFloat(unemploymentData.unemployed);

                // Find corresponding feature in GeoJSON
                const correspondingFeature = json.features.find(feature => feature.properties.LGA_name === dataState);
                if (correspondingFeature) {
                    correspondingFeature.properties.value = dataValue; // Assign unemployment value
                }
            });

            // Bind geojson features to the map
            svg.selectAll('path')
                .data(json.features)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('id', d => d.properties.LGA_name.replace(/\s/g, "_")) // Assign ID based on LGA name
                .style('fill', d => {
                    const value = d.properties.value;
                    return value ? color(value) : '#ccc'; // Handle missing data
                })
                .attr('stroke', '#333');

            // Load city data and add circles on top of the map
            d3.csv("../../VIC_city.csv").then(cityData => {
                // Add circles to represent the cities/towns on the map
                svg.selectAll("circle")
                    .data(cityData)
                    .enter()
                    .append("circle")
                    .attr("cx", d => projection([+d.lon, +d.lat])[0]) // Set x position using projection
                    .attr("cy", d => projection([+d.lon, +d.lat])[1]) // Set y position using projection
                    .attr("r", 5)                             // Set radius of the circle
                    .attr("fill", "red")                      // Set fill color of the circle
                    .style("opacity", 0.75)                   // Set opacity of the circle
                    .on('mouseover', function(event, d) { // Add mouseover event for city/town tooltips
                        d3.select(this).attr('r', 7); // Increase circle size on hover
                        svg.append("text")
                            .attr("x", projection([+d.lon, +d.lat])[0])
                            .attr("y", projection([+d.lon, +d.lat])[1] - 10)
                            .attr("class", "tooltip")
                            .attr("text-anchor", "middle")
                            .text(d.place)
                            .style("fill","black")
                            .style("font-size","14px");
                    })
                    .on('mouseout', function() { // Remove tooltip on mouseout
                        d3.select(this).attr('r', 5); // Restore original circle size
                        svg.selectAll(".tooltip").remove();
                    });
            }).catch(error => {
                console.error("Error loading city data:", error);
            });

        }).catch(error => {
            console.error("Error loading the GeoJSON data:", error);
        });
    }).catch(error => {
        console.error("Error loading the unemployment data:", error);
    });
}
