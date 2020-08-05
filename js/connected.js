clientWidth = document.documentElement.clientWidth;
clientHeight = document.documentElement.clientHeight;


var margin = { top: 25, right: 40, bottom: 35, left: 50 },
    width_connected = Math.round(clientWidth * 0.25),
	height_connected = Math.round(clientHeight * 0.32);


var svg_connected = d3.select(".connected_area")
    .append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


function initConnected(){

    //console.log("dl.keyLegend ", dl.keyLegend);
    color = d3.scaleOrdinal().domain(dl.keyLegend).range(d3.schemeTableau10);

    //console.log("dl.universityDelPaeseDellaMiaScelta  ",dl.universityDelPaeseDellaMiaScelta);
    //console.log("dl.data -> ", dl.data);




    //////////////////////////////////////////////////////////////////////
    dataConnected = getData();

    years = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019];

    // Attributes
    var attributes = ["Teaching", "Research", "Citations"]

    //  Select which attribute we want to show
    d3.select("#connectedSelect")
    .selectAll('connectedValues')
    .data(attributes)
    .enter()
    .append('option')
    .text(function (d) { return d; })
    .attr("value", function (d) { 
        return d; 
    })

    // X Axis
    var x = d3.scaleLinear()
      .domain(d3.extent(years))
      .range([ 0, width_connected ])
      .nice()

    xAxis = svg_connected.append("g")
      .attr("transform", "translate(0," + height_connected + ")")
      .call(d3.axisBottom(x).tickValues([2012,2013,2014,2015,2016, 2017, 2018, 2019]));

    // Y axis
    var y = d3.scaleLinear()
      .domain( [0, 100])
      .range([ height_connected, 0 ])

    yAxis = svg_connected.append("g")
      .call(d3.axisLeft(y).tickValues([10,20,30,40,50, 60, 70, 80, 90, 100]));

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

    series = 0;

    //console.log("--------------------------> ",dl.universityDelPaeseDellaMiaScelta);

    var line1,line2,line3,line4,line5,line6,line7,line8,line9,line10;
    list_lines = [line1 , line2 , line3, line4,line5,line6,line7,line8,line9,line10];

    var dot1,dot2,dot3,dot4,dot5,dot6,dot7,dot8,dot9,dot10;
    list_dots = [dot1,dot2,dot3,dot4,dot5,dot6,dot7,dot8,dot9,dot10];

    //console.log("CONNECTED.js : ",dl.universityDelPaeseDellaMiaScelta);
    for( el in dl.universityDelPaeseDellaMiaScelta){ 

    	//console.log("el vale ",el);

    	institution = dl.universityDelPaeseDellaMiaScelta[el].the_institution;
    	//console.log("institution  ", institution);
        //if(dl.cliccateInLegenda.includes(institution)){

        	datiPerSingolaInstitution = [];

        	for( i = 0; i < dl.uniDataConnected.length; i++){
        		if(dl.uniDataConnected[i].the_institution == institution){
        			//console.log("entrato");

        			datiPerSingolaInstitution.push(dl.uniDataConnected[i]);
        		}
        	}
        	//console.log("datiPerSingolaInstitution ",datiPerSingolaInstitution);

            //if(series < 1){
                list_lines[series] = svg_connected.append('g')
                  .append("path")
                  .attr("class", "connPath"+series)
                    .datum(datiPerSingolaInstitution)
                    //.attr("uni", dl.keyLegend[series])
                    .attr("uni", institution)
                    .attr("d", d3.line()
                      .x(function(d) { return x( parseInt(d.year))})
                      .y(function(d) { return y(parseFloat(d.the_teaching)) })
                    )
                    //.attr("stroke", color(dl.university))
                    .attr("stroke", color(institution))
                    .attr("stroke-opacity",function(d){
                             //console.log("cliccateInLegenda " ,dl.cliccateInLegenda);

                             if(!dl.cliccateInLegenda.includes(institution)){
                                return 0.10
                             }

                            return 1;
                
                     })
                    
                    .style("stroke-width", 3)
                    .style("fill", "none")

                list_dots[series] = svg_connected.append("g")
                    .selectAll('circle')
                    .data(datiPerSingolaInstitution)
                    .enter()
                    .append('circle')
                        .attr("cx", function(d) { return x( parseInt(d.year))})
                        .attr("cy", function(d) { return y(parseFloat(d.the_teaching)) })
                        .attr("r", 6)
                        //dl.coloreUniversityRector
                        //.style("fill", color(dl.university))
                        .attr("fill",

                         color(institution))
                        .attr("fill-opacity",function(d){
                             //console.log("cliccateInLegenda " ,dl.cliccateInLegenda);

                             if(!dl.cliccateInLegenda.includes(institution)){
                                return 0.10
                             }
                             else{
                                  return 1;

                             }
                
                     })
            //}
            //list_lines.push(line);
        //}
          
        series += 1;


    }

    //console.log("list_lines: ", list_lines);


    // A function that update the chart on the single attributes
    function update(selected) {

        //console.log("chiamo update")
         
        series = 0;
     
        for( el in dl.universityDelPaeseDellaMiaScelta){ 

	    	institution = dl.universityDelPaeseDellaMiaScelta[el].the_institution;
	    	//console.log("institution  ", institution);

	    	datiPerSingolaInstitution = [];

	    	for( i = 0; i < dl.uniDataConnected.length; i++){
	    		if(dl.uniDataConnected[i].the_institution == institution){
	    			//console.log("entrato");

	    			datiPerSingolaInstitution.push(dl.uniDataConnected[i]);
	    		}
	    	}


	    	//console.log("datiPerSingolaInstitution: ",datiPerSingolaInstitution);

	    	//console.log("dataFilter",dataFilter);

	    	//console.log(list_lines[series]);
	    	//console.log("line: ",line);

	    	 if(selected == "Teaching") dataFilter2 = datiPerSingolaInstitution.map(function(d){return {university:d.the_institution, year : d.year, value : d.the_teaching} });
	         else if(selected == "Research") dataFilter2 = datiPerSingolaInstitution.map(function(d){return {university:d.the_institution,year : d.year, value : d.the_reseach} });
           else dataFilter2 = datiPerSingolaInstitution.map(function(d){return {university:d.the_institution,year : d.year, value : d.the_citations} });
           
          //console.log("dataFilter2: ",dataFilter2[0].university);

	        list_lines[series]
	            .datum(dataFilter2)
	            .transition()
	            .duration(1000)
        
	            .attr("d", d3.line()
	                .x(function(d) { return x(parseInt(d.year)) })
	                .y(function(d) { return y(parseFloat(d.value)) })
	            );
               

	        list_dots[series]
		        .data(dataFilter2)
		        .transition()
		        .duration(1000)
		        .attr("cx", function(d) { return x(parseInt(d.year)) })
		        .attr("cy", function(d) { return y(parseFloat(d.value)) });

	        series += 1;


	    }





    }

    
    d3.select("#connectedSelect").on("change", function() {
        var selectedOption = d3.select(this).property("value");
        update(selectedOption);
    })
}

function getData(){
	//console.log("uniDataConnected -> ",dl.uniDataConnected);
    //return dl.uniData;

    return dl.uniDataConnected;
}

dl.addListener("changeColor", function (e) {
    changeColorConnected(true);
 });
 
 
function changeColorConnected(animate){
var duration = 0;
if (animate) duration = 300;

svg_connected.selectAll(".domain").transition().duration(duration).style("stroke", colors.getTextColor());
svg_connected.selectAll("line").transition().duration(duration).style("stroke", colors.getTextColor());
svg_connected.selectAll("text").transition().duration(duration).style("fill", colors.getTextColor());
svg_connected.selectAll(".connPath").transition().duration(duration).attr("stroke", colors.getAxisColor());
}

function removeConnected() {
    svg_connected.selectAll("*").remove();
    d3.select("#connectedSelect").selectAll("option").remove();
}



function updateConnected() {

   svg_connected.selectAll("*").remove();
   d3.select("#connectedSelect").selectAll("option").remove();
   initConnected();
}
