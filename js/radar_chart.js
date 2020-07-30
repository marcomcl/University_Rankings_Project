clientWidth = document.documentElement.clientWidth;
clientHeight = document.documentElement.clientHeight;


var margin_radar = { top: -60, right: 10, bottom: 10, left: -20 },
    width_radar = Math.round(clientWidth * 0.25),
    height_radar = Math.round(clientHeight * 0.32);


var svg_radar = d3.select(".radar_area").append("svg")
    //.attr("width", 600)
    //.attr("height", 600);
    .attr("width", '100%')
	.attr("height", '100%')
	.append("g")
   	.attr("transform", "translate(" + margin_radar.left + "," + margin_radar.top + ")");





function initRadarChart(){

	dataRadar = dl.universityDelPaeseDellaMiaScelta;

	//console.log("dataRadar -> ",dataRadar);

	countryUni = dl.universityCountry;

	//console.log("dataRadar 2: ",dataRadar);

	dataRadarPaeseSelected = [];

	let data = [];
	let features = ["teaching", "research","citations","international_outlook","income"]; //features del THE
	//generate the data
	for (var i = 0; i < 3; i++){
	    var point = {} // creo un object pount
	    //each feature will be a random number from 1-9
	    features.forEach(f => point[f] = 1 + Math.random() * 8);
	    //features.forEach(f => point[f] = )
	    data.push(point);
	}
	console.log("data  -> ",data);

	//prova solo su USA
	for( i in dataRadar){
	

		if(dataRadar[i].the_country == countryUni){

			teaching   = parseFloat(dataRadar[i].the_teaching);
			reseach    = parseFloat(dataRadar[i].the_reseach);
			citations  = parseFloat(dataRadar[i].the_citations);
			outlook    = parseFloat(dataRadar[i].the_international_outlook);
		    university = String(dataRadar[i].the_institution);


		    //console.log(university);
		  


			income  = dataRadar[i].the_international_outlook;
			if(income.includes("-")){
				income = parseFloat("0"); //valore di default DA CAMBIARE
			}else{
				income = parseFloat(income);
			}

			dataRadarPaeseSelected.push([teaching,reseach,citations,outlook,income,university]);
			//console.log(dataRadarPaeseSelected);
		} 
	}
	
	console.log("dataRadarPaeseSelected--> ",dataRadarPaeseSelected);

    dataPoints = [];
	for( i in dataRadarPaeseSelected){
		var point_USA = {};
		features.forEach(f => point_USA[f]=dataRadarPaeseSelected[i][0]);

		for( j in features){
			if(features[j] == "teaching"){
				point_USA["teaching"] = dataRadarPaeseSelected[i][0];
			}
			else if(features[j] == "reseach"){
				point_USA["reseach"] = dataRadarPaeseSelected[i][1];
			}
			else if(features[j] == "citations"){
				point_USA["citations"] = dataRadarPaeseSelected[i][2];
			}
			else if(features[j] == "international_outlook"){
				point_USA["international_outlook"] = dataRadarPaeseSelected[i][3];
			}
			else if(features[j] == "income"){
				point_USA["international_outlook"] = dataRadarPaeseSelected[i][4];
			}

			
		}

		

		point_USA["university"] =  dataRadarPaeseSelected[i][5];

		dataPoints.push(point_USA);
	}

	radius = Math.min(height_radar/6, width_radar/6);
	

	let radialScale = d3.scaleLinear()
	    .domain([0,10])
	    .range([0, radius]);


	let ticks_old = [2,4,6,8,10];
	let ticks = [10,20,30,40,50,60,70,80,90,100];


	ticks.forEach(t =>
	    svg_radar.append("circle")
	    .attr("cx", 300)
	    .attr("cy", 300)
	    .attr("fill", "none")
	    .attr("stroke", "gray")
	    .attr("r", radialScale(t)/2.6)
	);

	//scritta sugli assi
	ticks.forEach(t =>
	    svg_radar.append("text")
	    .attr("x", 305)
	    .attr("y", 300 - radialScale(t)/2.6)
		.style("fill", colors.getTextColor())
	    .text(t.toString())
	);


	function angleToCoordinate(angle, value){

	    let x = Math.cos(angle) * radialScale(value)/2.6;
	    let y = Math.sin(angle) * radialScale(value)/2.6;
	    return {"x": 300 + x, "y": 300 - y};
	}

	for (var i = 0; i < features.length; i++) {
	    let ft_name = features[i];
	    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
	    let line_coordinate = angleToCoordinate(angle, 100);
	    let label_coordinate = angleToCoordinate(angle, 110.5);

	    //draw axis line
	    svg_radar.append("line")
	    .attr("x1", 300)
	    .attr("y1", 300)
	    .attr("x2", line_coordinate.x)
	    .attr("y2", line_coordinate.y)
	    .attr("stroke",colors.getAxisColor());

	    //draw axis label
	    svg_radar.append("text")
	    .attr("x", label_coordinate.x)
		.attr("y", label_coordinate.y)
		.style("fill", colors.getTextColor())
		.text(ft_name);
	}


	let line = d3.line()
	    .x(d => d.x)
	    .y(d => d.y);
	let colors_radar = ["darkorange", "gray", "navy","blue", "green","yellow", "white","red","purple","brown"];



	

	function getPathCoordinates(data_point){
	    let coordinates = [];
	    for (var i = 0; i < features.length; i++){
	        let ft_name = features[i];
	        //console.log("ft_name: ",ft_name," ",data_point[ft_name]);
	       
	        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
	        //console.log("angle: ",angle);
	        //console.log("data_point: ",data_point);
	        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
	    }
	    return coordinates;
	}

	var keysLegend = [];


	//onsole.log("dataPoints : ", dataPoints);
	for (var i = 0; i < dataPoints.length; i ++){
	    //let d1 = data[i];
	    let d2 = dataPoints[i];
	    console.log("-----------> d2 ",dataPoints[i]);
	    let color = colors_radar[i];
	    //let coordinates_d1 = getPathCoordinates(d1);
	    let coordinates_d2 = getPathCoordinates(d2);

	    //draw the path element
	    svg_radar.append("path")
	    .datum(coordinates_d2)
	    .attr("d",line)
	    .attr("stroke-width", 6)
	    //.attr("stroke", color)
	    //.attr("fill", color)
	    .attr("university", function(){
	    	//console.log("214  - ",d2["university"]);
	    	dl.uniRadarChart.push(		[String(d2["university"]), color]			); 
	    	dl.keyLegend.push(String(d2["university"]));
	    	keysLegend.push(String(d2["university"]));
	    	//console.log("dl.keysLegend ", dl.keyLegend);

	    	return d2["university"];
	    })
	    //.attr("stroke-opacity", 5)
	    .attr("opacity", 0.55)
	    .on("mouseover", function(d) {
		    /*d3.select(this).style("fill", d3.select(this).attr('stroke'))
		          .attr('fill-opacity', 0.3);*/

	

            //console.log(d3.select(this).attr("university"));
		})
		.on("mouseout", function(d) {
		   /* d3.select(this).style("fill",color)
		          .attr('fill-opacity', 0.3);*/
		});


	}

	var color = d3.scaleOrdinal()
	  .domain(keysLegend)
	  .range(d3.schemeTableau10);


	dl.colorsRadar = color;
	//console.log("colorsRadar: ", dl.colorsRadar);

	svg_radar.selectAll("path")
				 .data(keysLegend)
				 //.enter()  
				 .attr("fill", function(d){ /*console.log(color(d));*/return dl.colorsRadar(d)});

	// select the svg area

	// create a list of keys
	var keys = ["Mister A", "Brigitte", "Eleonore", "Another friend", "Batman"]

}

//radar_chart();

function updateRadarChart() {
   svg_radar.selectAll("*").remove();
   initRadarChart();
}

function removeRadarChart() {
	svg_radar.selectAll("*").remove();
}

dl.addListener("changeColor", function (e) {
    changeColorRadar(true);
 });
 
 
 function changeColorRadar(animate){
    var duration = 0;
    if (animate) duration = 300;
    
    svg_radar.selectAll(".domain").transition().duration(duration).style("stroke", colors.getTextColor());
    svg_radar.selectAll("line").transition().duration(duration).style("stroke", colors.getTextColor());
    svg_radar.selectAll("text").transition().duration(duration).style("fill", colors.getTextColor());
 }