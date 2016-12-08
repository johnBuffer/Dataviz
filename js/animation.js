var svg1 = d3.select("#svg1").attr("width", 600).attr("height", 500),
    margin = {top: 50, right: 150, bottom: 50, left: 50},
    width = +svg1.attr("width") - margin.left - margin.right,
    height = +svg1.attr("height") - margin.top - margin.bottom;
	
var svg2 = d3.select("#svg2").attr("width", 600).attr("height", 500),
	width2 = +svg2.attr("width") - margin.left - margin.right,
    height2 = +svg2.attr("height") - margin.top - margin.bottom;

var dsv = d3.dsvFormat(";"); 
carData = dsv.parse(data);

var countries = ["US", "Japan", "Europe"];
var colors = ["#9AC4F8", "#757780", "#FCAB64"];
var duration = 200;
var radius = 4;

var currentSpec = [0, 0, 0, 0, 0, 0];

var xCircles = [0, 0, 0, 0, 0, 0];
var yCircles = [0, 0, 0, 0, 0, 0];
var oldXCircles = [0, 0, 0, 0, 0, 0];
var oldYCircles = [0, 0, 0, 0, 0, 0];
var yCircles = [0, 0, 0, 0, 0, 0];

var axCircles = [0, 0, 0, 0, 0, 0];
var ayCircles = [0, 0, 0, 0, 0, 0];

var rCircles = [0, 0, 0, 0, 0, 0];

var specName = ["MPG", "Cylinders", "Displacement", "Horsepower", "Weight", "Acceleration"];

var xScale = d3.scaleLinear()
	.domain(d3.extent(carData, function(d){
		return d.Weight;
	}))
	.range([0, width]);

var yScale = d3.scaleLinear()
	.domain(d3.extent(carData, function(d){
		return parseFloat(d.Horsepower);
	}))
	.range([height, 0]);

var colorScale = d3.scaleOrdinal()
	.domain(countries)
	.range(colors)

var bars = svg1.append("g")
	.attr("id", "bars")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")" )

var carName = svg1.append("text")
	.attr("id", "carName")
	.style("opacity", 0)
	.attr("text-anchor", "middle")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")" )
	.style("font-weight", "bold")
	
bars.selectAll("circle")
	.data(carData)
	.enter()
		.append("circle")
			.attr("r", radius)
			.attr("cx", function(d){
				return xScale(d.Weight)
			})
			.attr("cy", height)
			.style("opacity", 0)
			.attr("fill", function(d){
				return colorScale(d.Origin)
			})
			.on("mouseover", function(d){
				d3.select(this)
					.transition()
					.duration(duration)
						.attr("r", radius*4)

				carName
					.attr("x", function(){
						return xScale(d.Weight);
					})
					.attr("y", function(){
						return yScale(d.Horsepower) - 2;
					})
					.text(function(){
						return d.Car;
					})
					.interrupt()
					.transition()
					.duration(duration)
						.attr("y", function(){
							return yScale(d.Horsepower) - 20;
						})
						.style("opacity", 1)		
			})
			.on("mouseout", function(d){
				d3.select(this)
					.transition()
					.duration(duration)
						.attr("r", radius)

				carName.style("opacity", 0)
					.attr("x", -150)
					.attr("y", -150)
			})
			.on("click", function(d){
				changeValues(d)
			})
			.transition()
			.duration(1500)
				.delay(function(d,i){
					return i*10;
				})
				.attr("cy", function(d){
					return yScale(d.Horsepower)
				})
				.style("opacity", 1)
				

var legends = svg1.append("g")
	.attr("class", "legends")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")" );

var bottomAxis = legends.append("g")
	.attr("id", "botScale")
	.attr("transform", "translate(0," + height + ")");
	
bottomAxis.append("g")
	.call(d3.axisBottom(xScale))

legends.append("text")
	.attr("x", (width/2))
	.attr("y", (height + 32))
	.attr("font-weight", "bold")
	.attr("text-anchor", "middle")
	.text("Weight");

var leftAxis = legends.append("g")
	.attr("id", "leftScale");
	
leftAxis.append("g")
	.call(d3.axisLeft(yScale));

legends.append("g")
	.attr("transform", "translate(" + (-32) + "," + (height/2) + ")")
	.append("text")
		.attr("transform", "rotate(-90)")
		.attr("font-weight", "bold")
		.attr("text-anchor", "middle")
		.text("Horsepower");
	
var legend = legends.selectAll(".legend")
	.data(countries)
	.enter()
		.append("g")
			.attr("class", "legend")
			.attr("transform", "translate(" + (width + margin.left) + ",0)")
			.on("mouseover", function(d){
				bars.selectAll("circle")
					.transition()
					.duration(duration)
						.style("opacity", function(data){
							if(data.Origin == d)
								return 1;
							else
								return 0.1;
						})
			})
			.on("mouseout", function(d){
				bars.selectAll("circle")
					.transition()
					.duration(duration)
						.style("opacity", 1)
			});

legend.append("circle")
	.attr("r", radius)
	.attr("cx", 15)
	.attr("cy", function(d,i){
		return i*50;
	})
	.attr("fill-opacity", 0)
	.attr("stroke-width", 3)
	.attr("stroke", function(d){
		return colorScale(d)
	})
	
		
legend.append("text")
	.attr("x", 30)
	.attr("y", function(d,i){
		return i*50 +5;
	})
	.text(function(d){
		return d
	})


var specs = svg2.append("g")
	.attr("id", "specs")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

specs.selectAll(".spec")
	.data(currentSpec)
	.enter()
	.append("circle")
	.attr("class", "spec")
	.attr("cx", function(d, i) {return xCircles[i];})
	.attr("cy", function(d, i) {return yCircles[i];})
	.attr("fill", "red")
	.attr("r", 0)
	.on("mouseover", function(d, i) {
		svg2.selectAll(".ulabel")
		.transition()
		.style("opacity", function(d2, i2) {if (i==i2) return 1; return 0;});
		
		svg2.selectAll(".label")
		.transition()
		.style("opacity", function(d2, i2) {if (i==i2) return 1; return 0;});
	})
	.on("mouseout", function(d, i) {
		svg2.selectAll(".ulabel")
		.transition()
		.style("opacity", 0);
		
		svg2.selectAll(".label")
		.transition()
		.style("opacity", 1);
	});

	
specs.selectAll(".label")
	.data(currentSpec)
	.enter()
	.append("text")
	.attr("class", "label")
	.html("")
	.attr("fill", "black")
	.attr("opacity", 1)
	.attr("text-anchor", "middle")
	.on("mouseover", function(d, i) {
		svg2.selectAll(".ulabel")
		.transition()
		.style("opacity", function(d2, i2) {if (i==i2) return 1; return 0;});
		
		svg2.selectAll(".label")
		.transition()
		.style("opacity", function(d2, i2) {if (i==i2) return 1; return 0;});
	})
	.on("mouseout", function(d, i) {
		svg2.selectAll(".ulabel")
		.transition()
		.style("opacity", 0);
		
		svg2.selectAll(".label")
		.transition()
		.style("opacity", 1);
	});
	
specs.selectAll(".ulabel")
	.data(currentSpec)
	.enter()
	.append("text")
	.attr("class", "ulabel")
	.html("")
	.attr("fill", "black")
	.attr("opacity", 0)
	.style("pointer-event", "none")
	.attr("text-anchor", "middle");

var carLabel = specs.append("text")
	.attr("id", "carLabel")
	.attr("fill", "black")
	.attr("x", width2/2)
	.attr("y", 0)
	.attr("font-weight", "bold")
	.attr("text-anchor", "middle");
	
var gradient = svg2.append("defs")
  .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "100%")
    .attr("x2", "0%")
    .attr("spreadMethod", "pad");

gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#7FB069")
    .attr("stop-opacity", 1);

gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#BB342F")
    .attr("stop-opacity", 1);
	
var gaugeG = specs.append("g")
	.attr("id", "gaugeG")
	.style("opacity", 0);
	
gaugeG.append("circle")
	.attr("fill", "#7FB069")
	.attr("r", 8)
	.attr("cx", width2/2+100)
	.attr("cy", height2-12);
	
gaugeG.append("rect")
	.attr("id", "gauge")
	.style("fill", "url(#gradient)")
	.attr("width", 200)
	.attr("height", 16)
	.attr("x", width2/2-100)
	.attr("y", height2-20);
	
gaugeG.append("circle")
	.attr("fill", "#BB342F")
	.attr("r", 8)
	.attr("cx", width2/2-100)
	.attr("cy", height2-12);
	
var gaugeCursor = gaugeG.append("circle")
	.attr("fill", "white")
	.attr("r", 5)
	.attr("cx", width2/2+100)
	.attr("cy", height2-12);
	
gaugeG.append("text")
	.attr("fill", "black")
	.attr("x", width2/2-100-15)
	.attr("y", height2-8)
	.attr("font-weight", "bold")
	.attr("text-anchor", "end")
	.text("Power");
	
gaugeG.append("text")
	.attr("fill", "black")
	.attr("x", width2/2+100+15)
	.attr("y", height2-8)
	.attr("font-weight", "bold")
	.attr("text-anchor", "start")
	.text("Eco");
	
function initValues()
{
	for (var i=0; i<currentSpec.length; i++)
	{
		xCircles[i] = Math.random()*1000;
		yCircles[i] = Math.random()*500;
		
		oldXCircles[i] = xCircles[i];
		oldYCircles[i] = yCircles[i];
	}
}

function changeValues(object)
{
	carLabel.text(object.Car);
	
	var size = 75;
	for (var i=0; i<currentSpec.length; i++)
	{
		rCircles[i] = parseFloat(object[specName[i]]);
		var max = d3.max(carData, function(d) {return parseFloat(d[specName[i]]);});
		if (i != 5)
			rCircles[i] = rCircles[i]/max*size;
		else
			rCircles[i] = (1-rCircles[i]/max)*size;
	}
	
	svg2.selectAll(".spec")
		.data(currentSpec)
		.transition()
		.attr("fill", function(){
			return colorScale(object.Origin)
		})
		.attr("r", function(d, i) {return rCircles[i];});
		
	svg2.selectAll(".label")
		.html(function(d, i) {return specName[i]});
	
	svg2.selectAll(".ulabel")
		.html(function(d, i) {return object[specName[i]]});
	
	gaugeCursor
		.transition()
		.ease(d3.easeElastic)
		.duration(1000)
		.attr("cx", width2/2-100+rCircles[0]*200/75);
		
	gaugeG
		.transition()
		.duration(750)
		.style("opacity", 1);
}
	
function update()
{
	for (var i=0; i<currentSpec.length; i++)
	{	
		var frictionX = xCircles[i] - oldXCircles[i];
		var frictionY = yCircles[i] - oldYCircles[i];
		
		axCircles[i] = (width2/2-xCircles[i])*40-frictionX*1000;
		ayCircles[i] = (height2/2-yCircles[i])*40-frictionY*1000;
		
		for (var k=i+1; k<currentSpec.length; k++)
		{
			var dx = xCircles[i]-xCircles[k];
			var dy = yCircles[i]-yCircles[k];
			var dist = Math.sqrt(dx*dx+dy*dy);
			
			var minDist = rCircles[i]+rCircles[k];
			
			if (dist < minDist && dist > 0)
			{
				var rx = dx/dist;
				var ry = dy/dist;
				
				var f = (minDist-dist)*0.25;
				
				xCircles[i] += f*rx;
				yCircles[i] += f*ry;
				
				xCircles[k] -= f*rx;
				yCircles[k] -= f*ry;
			}
		}
	}
	
	for (var i=0; i<currentSpec.length; i++)
	{
		var newX = 2*xCircles[i] - oldXCircles[i] + axCircles[i]*0.016*0.016;
		var newY = 2*yCircles[i] - oldYCircles[i] + ayCircles[i]*0.016*0.016;
		
		oldXCircles[i] = xCircles[i];
		oldYCircles[i] = yCircles[i];
		
		xCircles[i] = newX;
		yCircles[i] = newY;
	}
		
	svg2.selectAll(".spec")
		.attr("cx", function(d, i) {return xCircles[i];})
		.attr("cy", function(d, i) {return yCircles[i];});
	
	svg2.selectAll(".label")
		.attr("x", function(d, i) {return xCircles[i];})
		.attr("y", function(d, i) {return yCircles[i];});
	
	svg2.selectAll(".ulabel")
		.attr("x", function(d, i) {return xCircles[i];})
		.attr("y", function(d, i) {return yCircles[i]+15;});
}

initValues();

setInterval(update, 16);




