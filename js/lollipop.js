clientWidth = document.documentElement.clientWidth;
clientHeight = document.documentElement.clientHeight;

var margin = {top: 40, right: 15, bottom: 90, left: 60},
    width_lollipop = Math.round(clientWidth * 0.40),
    height_lollipop = Math.round(clientHeight * 0.34);


var svg_lollipop = d3.select(".lollipop_area").append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


function initLollipop(){

	dataLollipop = getDataLollipop();
  
	var dict = {};

	for(i in dataLollipop){
	    k = dataLollipop[i].institution;
	    dict[k] = dataLollipop[i].cwur_score;
	}

	var elements = Object.keys(dict).map(function (key) {
	    return [key, dict[key]];
	});

	elements.sort(function(a,b){
	    return b[1] - a[1];
	});

    var top_10_scores = (elements.length >= 10) ? elements.slice(0, 10) : elements;

	var institutions = [];

    for(i in top_10_scores){
	    institutions.push(top_10_scores[i][0]);
	}


	var x = d3.scaleBand()
      .range([ 0, width_lollipop ])
      .domain(institutions)
      .padding(1);
    var xAxis = svg_lollipop.append("g")
      .attr("transform", "translate(0," + height_lollipop + ")")
      .transition().duration(1000).call(d3.axisBottom(x))
    
    xAxis.selectAll("text")
	  .style("font-size", 8)
	  .style("text-anchor", "end")
   	  .attr("transform", "translate(0,+15),rotate(-15)" );

	var y = d3.scaleLinear()
	  .range([ height_lollipop, 0])
	  .domain([0, d3.max(dataLollipop, function(d) { return +(d.cwur_quality_of_education);})]);
	var yAxis = svg_lollipop.append("g")
	  .attr("class", "myYaxis")
	  .transition().duration(1000).call(d3.axisLeft(y));

	xAxis.selectAll("line")
	.style("stroke", colors.getAxisColor());

	xAxis.select(".domain")
		.style("stroke", colors.getAxisColor());

	xAxis.selectAll("text")
	.style("fill", colors.getTextColor())

	yAxis.selectAll("line")
	.style("stroke", colors.getAxisColor());

	yAxis.select(".domain")
	.style("stroke", colors.getAxisColor());

	yAxis.selectAll("text")
	.style("fill", colors.getTextColor())

	var picks = ["Quality of Education", "Quality of Faculty", "Influence"]

	d3.select("#lollipopBtn")
    .selectAll('lollipopValues')
    .data(picks)
    .enter()
    .append('option')
    .text(function (d) { return d; })
    .attr("value", function (d) { 
        return d; 
    })

    var j = svg_lollipop.selectAll(".myLine")
	    .data(dataLollipop)
	    j
	      .enter()
	      .append("line")
	      .attr("class", "myLine")
	        .merge(j)
	        .attr("x1", function(d) { console.log(x(d.the_institution)) ; return x(d.the_institution); })
	        .attr("x2", function(d) { return x(d.the_institution); })
	        .attr("y1", y(0))
	        .attr("y2", function(d) { return y(d.cwur_quality_of_education); })
	        .attr("stroke", "grey")

	var u = svg_lollipop.selectAll("circle")
	      .data(dataLollipop)
	      u
	        .enter()
	        .append("circle")
	        .merge(u)
	          .attr("cx", function(d) { return x(d.the_institution); })
	          .attr("cy", function(d) { return y(d.cwur_quality_of_education); })
	          .attr("r", 8)
	          .attr("fill", "#69b3a2");


	function update(selectedVar) {

		var dataFilter;

        if(selectedVar == "Quality of Education") dataFilter = dataLollipop.map(function(d){return {the_institution : d.the_institution, value : +(d.cwur_quality_of_education)} });
        else if(selectedVar == "Quality of Faculty") dataFilter = dataLollipop.map(function(d){return {the_institution : d.the_institution, value : +(d.cwur_quality_of_faculty)} });
		else dataFilter = dataLollipop.map(function(d){return {the_institution : d.the_institution, value : +(d.cwur_influence)} });
		
		svg_lollipop.selectAll("circle").remove();
		svg_lollipop.selectAll(".myLine").remove();

	    // X axis
	    x.domain(institutions)
		xAxis.call(d3.axisBottom(x))
		
	    // Add Y axis
	    y.domain([0, d3.max(dataFilter, function(d) { return d.value;}) ]).range([ height_lollipop, 0]);
		yAxis.call(d3.axisLeft(y));
		
		svg_lollipop.selectAll(".domain").style("stroke", colors.getTextColor());
		svg_lollipop.selectAll("line").style("stroke", colors.getTextColor());
		svg_lollipop.selectAll("text").style("fill", colors.getTextColor());
	    

	    // variable j: map data to existing line
	    j
	      .data(dataFilter)
	      .enter()
	      .append("line")
	      .attr("class", "myLine")
	      .merge(j)
	      .transition()
	      .duration(1000)
	        .attr("x1", function(d) { return x(d.the_institution); })
	        .attr("x2", function(d) { return x(d.the_institution); })
	        .attr("y1", y(0))
	        .attr("y2", function(d) { return y(d.value); })
	        .attr("stroke", "grey")


	    // variable u: map data to existing circle
	    u
	      .data(dataFilter)
	      .enter()
	      .append("circle")
	      .merge(u)
	      .transition()
	      .duration(1000)
	        .attr("cx", function(d) { return x(d.the_institution); })
	        .attr("cy", function(d) { return y(d.value); })
	        .attr("r", 8)
			.attr("fill", "#69b3a2");
			
	}

    d3.select("#lollipopBtn").on("change", function() {
        var pick = d3.select(this).property("value");
        update(pick);
    })

}


function updateLollipop() {
   svg_lollipop.selectAll("*").remove();
   d3.select("#lollipopBtn").selectAll("option").remove();
   initLollipop();
}

function removeLollipop() {
  svg_lollipop.selectAll("*").remove();
  d3.select("#lollipopBtn").selectAll("option").remove();
}

function getDataLollipop(){
    return dl.universityDelPaeseDellaMiaScelta;
}

dl.addListener("changeColor", function (e) {
    changeColorLollipop(true);
 });
 
 
function changeColorLollipop(animate){
var duration = 0;
if (animate) duration = 300;

svg_lollipop.selectAll(".domain").transition().duration(duration).style("stroke", colors.getTextColor());
svg_lollipop.selectAll("line").transition().duration(duration).style("stroke", colors.getTextColor());
svg_lollipop.selectAll("text").transition().duration(duration).style("fill", colors.getTextColor());
}
