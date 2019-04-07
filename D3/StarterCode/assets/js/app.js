var svg_width = 960;
var svg_height = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svg_width - margin.left - margin.right;
var height = svg_width - margin.top - margin.bottom;

var svg = d3.select("body")
  .append("svg")
  .attr("width", svg_width)
  .attr("height", svg_height);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

// Import Data
d3.csv("data.csv", function(err, health_data) {
  if (err) throw err;
console.log(health_data)

  health_data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  var xLinearScale = d3.scaleLinear().range([0, width]);
  var yLinearScale = d3.scaleLinear().range([height, 0]);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var xMin;
  var xMax;
  var yMin;
  var yMax;
  
  xMin = d3.min(health_data, function(data) {
      return data.healthcare;
  });
  
  xMax = d3.max(health_data, function(data) {
      return data.healthcare;
  });
  
  yMin = d3.min(health_data, function(data) {
      return data.poverty;
  });
  
  yMax = d3.max(health_data, function(data) {
      return data.poverty;
  });
  
  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([yMin, yMax]);
  console.log(xMin);
  console.log(yMax);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
  .data(health_data)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.healthcare +1.5))
  .attr("cy", d => yLinearScale(d.poverty +0.3))
  .attr("r", "12")
  .attr("fill", "blue")
  .attr("opacity", .5)

  .on("mouseout", function(data, index) {
    toolTip.hide(data);
  });

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (abbr + '%');
      });

  chartGroup.call(toolTip);

  circlesGroup.on("click", function(data) {
    toolTip.show(data);
  })
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  chartGroup.append("text")
  .style("font-size", "12px")
  .selectAll("tspan")
  .data(health_data)
  .enter()
  .append("tspan")
      .attr("x", function(data) {
          return xLinearScale(data.healthcare +1.3);
      })
      .attr("y", function(data) {
          return yLinearScale(data.poverty +.1);
      })
      .text(function(data) {
          return data.abbr
      });

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("No Healtcare(%)");

  chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Poverty (%)");
});
