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

	//console.log("------ > keyLegend: ",dl.keyLegend);

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
	    //.style("fill", function(d){ /*console.log("d vale ",d , " color vale ", color(d));*/return color(d)})
	    .attr("fill",function(d){ /*console.log("d vale ",d , " color vale ", color(d));*/return color(d)})
	    .on("click", function(d){

	    		if(!dl.cliccateInLegenda.includes(d)){
		    		//console.log("legenda cliccata vale : ",d);
		    		d3.select(this).style("fill", "black");
		    		dl.cliccateInLegenda.push(d);
		    		//console.log("cliccateInLegenda ", dl.cliccateInLegenda);
					dl.legendFilter();
				}else{
					const index = dl.cliccateInLegenda.indexOf(d);
						if (index > -1) {
							dl.cliccateInLegenda.splice(index, 1);
						}
					d3.select(this).style("fill",function(d){ /*console.log("d vale ",d , " color vale ", color(d));*/return color(d)})
					dl.legendFilter();

				}

		});


	// Add one dot in the legend for each name.
	Svg.selectAll("mylabels")
	  .data(keys)
	  .enter()
	  .append("text")
	    .attr("x", 120)
	    .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
	    .style("fill", function(d){ 

	    	//console.log("d vale: ", d);
	    	if(dl.university == d){
	    		dl.coloreUniversityRector = color(d);
	    		//console.log("color(d) vale: ", color(d));
	    	}
	    	return color(d)}

	    )
	    .text(function(d){ return d})
	    .attr("text-anchor", "left")
	    .style("alignment-baseline", "middle")

}

function updateLegend (){
   svg_legend.selectAll("*").remove();
   //console.log("updateLegend called");
   //console.log("universityDelPaeseDellaMiaScelta: ",dl.universityDelPaeseDellaMiaScelta);
   dl.keyLegend.splice(0,  dl.keyLegend.length);

   for (el in dl.universityDelPaeseDellaMiaScelta){
   		string_uni_legend = dl.universityDelPaeseDellaMiaScelta[el].the_institution;
   		dl.keyLegend.push(string_uni_legend );

   }
   //console.log(dl.keyLegend);
   initLegend();
}

function removeLegend() {
	svg_legend.selectAll("*").remove();
	 //initLegend();
}



function removeDuplicates(array) {
  array.splice(0, array.length, ...(new Set(array)))
};
