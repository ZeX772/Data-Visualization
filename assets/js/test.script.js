function init() {
    // Step 1: Set up the dimensions for the SVG
    var w = 500;
    var h = 300;
  
    // Step 2: Create the Mercator projection
    var projection = d3.geoMercator()
        .center([145, -36.5])  // Center the map on Victoria, Australia
        .translate([w / 2, h / 2])  // Translate to the center of the SVG
        .scale(2450);  // Scale the map to fit the view
  
    // Step 3: Create the path generator
    var path = d3.geoPath()
        .projection(projection);
  
    // Step 4: Append the SVG canvas to the body
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("fill", "blue");
  
    // Step 5: Set the color scale using the provided color scheme
    var color = d3.scaleQuantize()
      .range(['#f2f0f7', '#cbc9e2', '#9e9ac8', '#756bb1', '#54278f']);  // Custom color scheme
  
    // Step 6: Load the unemployment data from CSV
    d3.csv("VIC_LGA_unemployment.csv").then(function(unemploymentData) {
      
      // Step 7: Convert unemployment data to a map for easier access
      var unemploymentMap = {};
      unemploymentData.forEach(function(d) {
        unemploymentMap[d.LGA] = +d.unemployed;  // Convert to number
      });
  
      // Step 8: Load the GeoJSON data and merge with unemployment data   
      d3.json("LGA_VIC.json").then(function(json) {
        console.log(json);  // Check the structure of the GeoJSON
  
        // Step 9: Merge the CSV data with GeoJSON data
        for (var i = 0; i < unemploymentData.length; i++) {
          var dataLGA = unemploymentData[i].LGA;
          var dataValue = +unemploymentData[i].unemployed;
  
          for (var j = 0; j < json.features.length; j++) {
            var jsonLGA = json.features[j].properties.name;
  
            if (dataLGA === jsonLGA) {
              json.features[j].properties.value = dataValue;
              break;
            }
          }
        }
  
        // Step 10: Set the color domain based on unemployment data
        var unemploymentValues = json.features.map(feature => feature.properties.value);
        color.domain(d3.extent(unemploymentValues));  // Set the color domain based on the unemployment values
  
        // Step 11: Draw the paths for each LGA in the GeoJSON
        svg.selectAll("path")
          .data(json.features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("fill", function(d) {
            var unemploymentValue = d.properties.value || 0;  // Use the value assigned
            return color(unemploymentValue);
          })
          .attr("stroke", "#333")
          .attr("stroke-width", "1");
  
        // Step 12: Load the city data from CSV
        d3.csv("VIC_city.csv").then(function(cityData) {
          
          // Step 13: Add circles for each city/town
          svg.selectAll("circle")
            .data(cityData)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
              // Use the projection to get the x coordinate
              return projection([+d.lon, +d.lat])[0];
            })
            .attr("cy", function(d) {
              // Use the projection to get the y coordinate
              return projection([+d.lon, +d.lat])[1];
            })
            .attr("r", 4)  // Set radius of the circles
            .style("fill", "red")  // Color of the circles
            .style("opacity", 0.7);  // Semi-transparent circles
        });
      });
    });
  }
  
  window.onload = init;