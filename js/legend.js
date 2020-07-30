clientWidth = document.documentElement.clientWidth;
clientHeight = document.documentElement.clientHeight;



var margin_legend = { top: 10, right: 0, bottom: 10, left: -50 },
    width_legend = Math.round(clientWidth * 0.25),
    height_legend = Math.round(clientHeight * 0.32);


var svg_legend = d3.select(".legend_area").append("svg")
	.attr("id", "my_dataviz2")
    .attr("width", '100%')
    .attr("height",'100%')	
	.attr("transform", "translate(" + margin_legend.left + ", " +  margin_legend.top  + ")");


function initLegend(){

	// select the svg area
	var Svg = d3.select("#my_dataviz2")

	var keys = dl.keyLegend;

	//console.log("keys: ",keys);

	/*countKey = 0;
	for (i in keys){
		if(keys[i] == "University of Oslo"){
			countKey += 1;
		}
	}
	console.log("countKey vale: ", countKey);*/

	removeDuplicates(keys);
	//console.log("keys remove removeDuplicates: ",keys);




    var color = d3.scaleOrdinal()
	  .domain(keys)
	  .range(d3.schemeTableau10);


	//console.log("color	-> ",color	);

	Svg.selectAll("mydots")
	  .data(keys)
	  .enter()
	  .append("circle")
	    .attr("cx", 100)
	    .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
	    .attr("r", 7)
	    .style("fill", function(d){ /*console.log("d vale ",d , " color vale ", color(d));*/return color(d)})

	// Add one dot in the legend for each name.
	Svg.selectAll("mylabels")
	  .data(keys)
	  .enter()
	  .append("text")
	    .attr("x", 120)
	    .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
	    .style("fill", function(d){ return color(d)})
	    .text(function(d){ return d})
	    .attr("text-anchor", "left")
	    .style("alignment-baseline", "middle")

}

function updateLegend (){
   svg_legend.selectAll("*").remove();

   initLegend();
}

function removeLegend() {
	svg_legend.selectAll("*").remove();
	 //initLegend();
}



function removeDuplicates(array) {
  array.splice(0, array.length, ...(new Set(array)))
};
