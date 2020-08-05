clientWidth = document.documentElement.clientWidth;
clientHeight = document.documentElement.clientHeight;


var margin_map = { top: 10, right: 10, bottom: 10, left: 10 },
    width_map = Math.round(clientWidth * 0.25),
	height_map = Math.round(clientHeight * 0.32);
	
var svg_map = d3.select(".map_area")
.append("svg")
//.attr("class", "tooltip") //manage click event ADD TOOLTIP
.attr("width", '85%')
.attr("height", '100%')
.append("g")//
.attr("transform", "translate(" + margin_map.left + "," + margin_map.top + ")");
	
var projection = d3.geoMercator()
	.center([-40, 30])
	.scale(100)
	.translate([width_map / 2, height_map / 2]);
	
//tooltip del pop up
var tooltip = d3.select("div.tooltip");

  //g = svg_map.append("g");
 
var last_zoom_transform;

//array usato quando seleziono un paese
paesi_selezionati = [];
//d.propertties name dei paesi inseriti nella mappa

// Handmade legend
/*svg_map.append("circle").attr("cx",200).attr("cy",130).attr("r", 6).style("fill", colors.getColorUniversity())
svg_map.append("circle").attr("cx",200).attr("cy",160).attr("r", 6).style("fill", colors.getColorSelectedUniversity())
svg_map.append("text").attr("x", 220).attr("y", 130).text("variable A").style("font-size", "15px").attr("alignment-baseline","middle")
svg_map.append("text").attr("x", 220).attr("y", 160).text("variable B").style("font-size", "15px").attr("alignment-baseline","middle")
*/


paesi_nella_mappa_name = [];
function initMap(){
	//var tooltip = d3.select("div.tooltip");
	//data = getDataMap();
	/////////////////////////////////////
	/*var legend = svg_map.selectAll('legend')
	    .data(['university','selected', 'selected from scatter'])
	    .enter().append('g')
	    .attr('class', 'legend')
		.attr('transform', function (d, i) { return 'translate(20,' + i * 20 + ')'; })
		.style("z-index", 1000);

	  legend.append('rect')
	    .attr('x', width_scatter)
	    .attr('width', 15)
	    .attr('height', 15)
	    .attr('class', 'legend_rect')
	   .style('fill', function (d) { 
	   	  //console.log("d  ", d);
          if(d == "university"){
            return colors.getColorUniversity();
          }
          else if(d == "selected"){
            return colors.getColorSelectedUniversity();
          }
          else if(d == "selected from scatter"){
            return  colors.getColorUniversityScatter();
          }
          else{

            return "black";

          }

        });

	  legend.append('text')
	    .attr('x', width_scatter - 2)
	    .attr('y', 9)
	    .attr('dy', '.25em')
	    .style('text-anchor', 'end')

	        .style('fill', function (d) { 

          if(d == "university"){
            return colors.getColorUniversity();
          }
          else if(d == "selected"){
            return colors.getColorSelectedUniversity();
          }
          else if(d == "selected from scatter"){
            return  colors.getColorUniversityScatter();
          }
          else{

            return "black";

          }

        })
	    .text(function (d) { return d; });*/
	/*const svg = d3.create("svg")
    .attr("width", 400)
    .attr("height", 400)*/
  
  // Legend as a group
  /*const legend = svg_map.append("g")
    // Apply a translation to the entire group 
    .attr("transform", "translate(100, 100)")
  
  const size = 20;
  const border_padding = 15;
  const item_padding = 5;
  const text_offset = 2;
  domains = ["Phase 1", "Phase 2", "Phase 3", "Phase 4"];
  palette = ["#f58442", "#ede02d", "#9fbda2", "#6dbfd6"];
  colorMap = d3.scaleOrdinal(palette).domain(domains);
  // Border
  legend
    .append('rect')
    .attr("width", 120)
    .attr("height", 125)
    .style("fill", "none")
    .style("stroke-width", 1)
    .style("stroke", "black");
  
  // Boxes
  legend.selectAll("boxes")
    .data(domains)
    .enter()
    .append("rect")
      .attr("x", border_padding)
      .attr("y", (d, i) => border_padding + (i * (size + item_padding)))
      .attr("width", size)
      .attr("height", size)
      .style("fill", (d) => colorMap(d));
  
  // Labels
  legend.selectAll("labels")
    .data(domains)
    .enter()
    .append("text")
      .attr("x", border_padding + size + item_padding)
      .attr("y", (d, i) => border_padding + i * (size + item_padding) + (size / 2) + text_offset)
      // .style("fill", (d) => color(d))
      .text((d) => d)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .style("font-family", "sans-serif");*/
  
  //return svg.node();





	////////////////////////////////////////



	var path = d3.geoPath()
	    .projection(projection);

	//definisce il behaviour dello zoom
	var zoom = d3.zoom()
	        .scaleExtent([0,20])
	        .on('zoom', zoomed); //sullo zoom action chiamo zoomed()
      
	d3.json("./data/countries.topo.json", function(error, us,names) {
	     
		 //disegno la mappa
		 svg_map.append("g").append("g")
			 .selectAll("path")
			 .data(topojson.feature(us, us.objects.countries).features)//prendo i singoli paesi dal topo.json
			 .enter()
			 .append("path")//aggiungendo ad g ogni path  a cui do id quello desiderato, attributo id (vedi topo.json)
			 .attr("id", function(d) { return d.id; })
			 //.attr("d", path)
			 .attr("country",function(d){ paesi_nella_mappa_name.push(d.properties.name);	return d.properties.name})
			 .attr("class", "map_path")//classe attribute to each path
			 .attr("d", d3.geoPath().projection(projection))
			 .style("stroke", colors.getColorMarginCountry()) //+ lo stile per ogni componente path,setto il colore del confine
			 .attr("stroke-width",1); //in pratica ogni path è un country

	    //add points to the map, taking them from csv

		dataMap = dl.uniCoordinates;
		//console.log(dataMap[0]);
		//console.log(dataMap);
        svg_map.append('g').append("g").attr('class', 'circles_container').selectAll("circle")

            .data(dataMap)//qua si passa la funzione per i punti asseconda degli anni
            .enter()
            .append("circle")
            .attr('class', 'universita') //assegno una classe ai punti, per accedervi succesivamente
            .attr("institution",function (d) { return d[3];})
            .attr("cx", function (d) {	 	return projection([+d[0], +d[1]])[0];})	
			.attr("cy", function (d) {	 	return projection([+d[0], +d[1]])[1];})
			.attr("r", 2.90)	
            .attr("lat" ,function (d) { return d[1];})
            .attr("long",function (d) { return d[0];})
            .attr("uni",function (d) { return d[2];})
            .attr("country",function (d) { return d[3];})
            .style("fill", function(d){
				if(dl.dotHighlighted.includes(d[2]))
				return colors.getColorUniversityScatter();
				else
					return colors.getColorUniversity();
			})
			.style("opacity", 1);
        
		//console.log("dotHighlighted -> ",dl.dotHighlighted);
        svg_map.call(zoom);
		svg_map.call(zoom.transform, d3.zoomIdentity.scale(1.1))

	    // create a tooltip to fill permanently a country
	  	var Tooltip = d3.select("#div_template")
			.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("background-color", "#ffffff")
			.style("border", "solid")
			.style("border-width", "2px")
			.style("border-radius", "5px")
			.style("padding", "5px")

        //interazione
		svg_map.selectAll("path")
			.attr("stroke","green")
			.attr("stroke-width",1)
	        .style("fill", colors.getBgMap())
		    .attr("d", path )
			.on("mouseover",function(d,i){

	            d3.select(this).style("fill",colors.getMapOver()).attr("stroke-width",2);

	            var id = d3.select(this);
               	var paeseId = id.attr("id");

				tooltip.style("visibility", "visible")
				.style("top", (d3.event.pageY) + "px")
				.style("left", (d3.event.pageX + 10) + "px")
				.html(d.properties.name);

	        })
	        .on("click",function(d,i){  //with this event we select a country

            	var id = d3.select(this);


            	
            	var paeseId = id.attr("country");
				if(!dl.countriesSelected.includes(paeseId)){
					Tooltip
				      .style("opacity", 1)
				    d3.select(this)
				      .style("fill", colors.getColorCountry())
				      .style("opacity", 1)

					//console.log(paeseId);
					uni_selected_with_the_country = null;
					if(paesi_nella_mappa_name.includes(paeseId)){
						//per riferimento vedi dataloader

						if(paeseId == "United States"){
							uni_selected_with_the_country = svg_map.selectAll("circle[country=USA]").style("fill", colors.getColorSelectedUniversity());	
						}
						else if(paeseId == "Saudi Arabia"){
							uni_selected_with_the_country = svg_map.selectAll("circle[country=SAU]").style("fill", colors.getColorSelectedUniversity());
						}
						else if(paeseId == "United Kingdom"){
							uni_selected_with_the_country = svg_map.selectAll("circle[country=UK]").style("fill", colors.getColorSelectedUniversity());
						}
						else if(paeseId == "South Africa"){
							uni_selected_with_the_country = svg_map.selectAll("circle[country=SouthAfrica]").style("fill", colors.getColorSelectedUniversity());
						}
						else if(paeseId == "Russian Federation"){
							uni_selected_with_the_country = svg_map.selectAll("circle[country=Russia]").style("fill", colors.getColorSelectedUniversity());
						}
						else if(paeseId == "South Korea"){
							uni_selected_with_the_country = svg_map.selectAll("circle[country=SouthKorea]").style("fill", colors.getColorSelectedUniversity());
						}
						else if(paeseId == "New Zealand"){
							uni_selected_with_the_country = svg_map.selectAll("circle[country=NewZealand]").style("fill", colors.getColorSelectedUniversity());
						}
						else if(paeseId == "Czech Rep."){
							uni_selected_with_the_country = svg_map.selectAll("circle[country=CECREP]").style("fill", colors.getColorSelectedUniversity());
						}
						else if(paeseId == "United Arab Emirates"){
							uni_selected_with_the_country = svg_map.selectAll("circle[country=UAE]").style("fill", colors.getColorSelectedUniversity());
						}
						else{

							uni_selected_with_the_country = svg_map.selectAll("circle[country="+String(paeseId)+"]").style("fill", colors.getColorSelectedUniversity());

						}

						if(!dl.countriesSelected.includes(paeseId)){
							dl.countriesSelected.push(paeseId);
						}

						lista_uni = uni_selected_with_the_country["_groups"][0];

						for (i = 0; i < lista_uni.length; i++){
							if(d3.select(lista_uni[i]).classed("universita") == true ){

								universitaDaDOM = lista_uni[i].getAttribute("uni");
								if(!dl.uniSelected.includes(universitaDaDOM)){
									dl.uniSelected.push(universitaDaDOM)

								}


							}else{
								break;
							}
						
						}
					}
				

					
				} else{ //aggiunto da Marco
					var id = d3.select(this);
            	
					var paeseId = id.attr("country");

					if(dl.countriesSelected.includes(paeseId)){
						

						const index = dl.countriesSelected.indexOf(paeseId);
						if (index > -1) {
							dl.countriesSelected.splice(index, 1);
						}
					}

					//console.log("dl.countriesSelected = ", dl.countriesSelected);


					Tooltip
						.style("opacity", 1)

						d3.select(this)
						.style("fill", colors.getBgMap())
						.style("opacity", 1)
							

					var offsetL = document.getElementById('map').offsetLeft+10;
					var offsetT = document.getElementById('map').offsetTop+10;

					uni_selected_with_the_country = null;


					//Rimozione delle università (cambio di colore)
					if(paeseId == "United States"){
						uni_selected_with_the_country = svg_map.selectAll("circle[country=USA]").style("fill", colors.getColorUniversity());
					} 
					else if(paeseId == "Saudi Arabia"){
						uni_selected_with_the_country = svg_map.selectAll("circle[country=SAU]").style("fill", colors.getColorUniversity());
					}
					else if(paeseId == "United Kingdom"){
						uni_selected_with_the_country = svg_map.selectAll("circle[country=UK]").style("fill", colors.getColorUniversity());
					}
					else if(paeseId == "South Africa"){
						uni_selected_with_the_country = svg_map.selectAll("circle[country=SAF]").style("fill", colors.getColorUniversity());
					}
					else if(paeseId == "Russian Federation"){
						uni_selected_with_the_country = svg_map.selectAll("circle[country=Russia]").style("fill", colors.getColorUniversity());
					}
					else if(paeseId == "South Korea"){
						uni_selected_with_the_country = svg_map.selectAll("circle[country=SouthKorea]").style("fill", colors.getColorUniversity());
					}
					else if(paeseId == "New Zealand"){
						uni_selected_with_the_country = svg_map.selectAll("circle[country=NewZealand]").style("fill", colors.getColorUniversity());
					}
					else if(paeseId == "Czech Rep."){
						uni_selected_with_the_country = svg_map.selectAll("circle[country=CZ]").style("fill", colors.getColorUniversity());
					}
					else if(paeseId == "United Arab Emirates"){
						uni_selected_with_the_country = svg_map.selectAll("circle[country=UAE]").style("fill", colors.getColorUniversity());
					}
					else{
						uni_selected_with_the_country = svg_map.selectAll("circle[country="+String(paeseId)+"]").style("fill", colors.getColorUniversity());
					}

					lista_uni = uni_selected_with_the_country["_groups"][0];

					for (i = 0; i < lista_uni.length; i++){
						if(d3.select(lista_uni[i]).classed("universita") == true ){
							universitaDaDOM = lista_uni[i].getAttribute("uni");
							if(dl.uniSelected.includes(universitaDaDOM)){
								const index = dl.uniSelected.indexOf(universitaDaDOM);
								if (index > -1) {
									dl.uniSelected.splice(index, 1);
								}
							}
						}else{
							break;
						}
					
					}
				}
				//Chiamo mapFilter
				
				dl.mapFilter();

	        })
	        .on("mousemove",function(d){

                var id = d3.select(this);
               	var paeseId = id.attr("id");	
					            
               	for( el in dataMap){
               		if(paeseId == dataMap[el].country_code){
               			country = dataMap[el].location;
               		}

               	}

	            tooltip.style("top", (d3.event.pageY) + "px")
                       .style("left", (d3.event.pageX + 10) + "px")

	        })
	        .on("mouseout",function(d,i){
	                
	            d3.select(this).style("fill",function(){
					var paeseId = d3.select(this).attr("country");
					if(dl.countriesSelected.includes(paeseId))
						return colors.getColorCountry()
					else
						return colors.getBgMap();
				})
				.attr("stroke-width",1);
            	tooltip.style("visibility", "hidden");
	        
	        });

	    //stessa cosa fatta per la mappa la faccio per l'università
	    svg_map.selectAll("circle")
	    		

			.on("mouseover",function(d,i){

	            lat = d3.select(this).attr("lat");
	            long = d3.select(this).attr("long");
	            institution = d3.select(this).attr("uni");

                var universityOver= d3.select(this);
	            tooltip.style("visibility", "visible")
                       .style("top", (d3.event.pageY) + "px")
                       .style("left", (d3.event.pageX + 10) + "px")
                       //.html(institution+" lat: "+lat+" long: "+long);
                       .html(institution);

                 

			})
			.on("mouseout", function(d){
				tooltip.style("visibility", "hidden")
			})
	});

	svg_map.call(zoom);
	svg_map.call(zoom.transform, d3.zoomIdentity.scale(1.1))




	function zoomed() {
		last_zoom_transform = d3.event.transform;
		

		var radius = 2.90;
		if (last_zoom_transform.k != undefined) {
			k = last_zoom_transform.k;
			if (k > 6) k = 6;
			radius = radius / k;
		}
		svg_map.selectAll("path")
			.attr('transform', last_zoom_transform);
		
		svg_map.select(".circles_container").selectAll("circle").attr('r', radius).attr('transform', last_zoom_transform);


		//riduco il boundary dei paesi relativamente allo zoom
		svg_map.selectAll("path")
		.style("stroke-width", 1 / last_zoom_transform.k);

		//g.attr("transform", last_zoom_transform);  //non togliere


	}

	//prendo i dati del csv e li modifico di conseguenza
	function getDataMap(){
		return dl.filteredPar;
	}


}

function updateMap() {
    //console.log(dl.uniSelected);
	radius = 2.90;

	if (last_zoom_transform != undefined && last_zoom_transform.k != undefined) {
		k = last_zoom_transform.k;
		if (k > 6) k = 6;
		radius = radius / k;
	}

	//if(someSelected == true){

	newData = dl.uniCoordinates;

	svg_map.select(".circles_container").selectAll("circle").remove();

	var edit = svg_map.select(".circles_container").selectAll("circle").data(newData);
	//edit.exit().remove();
	edit.enter().append('circle')
		//.transition().duration(300)
		.attr('class', 'universita') //assegno una classe ai punti, per accedervi succesivamente
		.attr("institution",function (d) { return d[3];})
		.attr("cx", function (d) {	 	return projection([+d[0], +d[1]])[0];})	
		.attr("cy", function (d) {	 	return projection([+d[0], +d[1]])[1];})	
		.attr("r",  0)
		.attr("transform", last_zoom_transform)
		.attr("lat" ,function (d) { return d[1];})
		.attr("long",function (d) { return d[0];})
		.attr("uni",function (d) { return d[2];})
		.attr("country",function (d) { return d[3];})
		.style("opacity", 0.5);
	//animazione dei circles
	svg_map.select(".circles_container").selectAll("circle").data(newData)//.transition().duration(300)
		.attr("cx", function (d) {	 	return projection([+d[0], +d[1]])[0];})	
		.attr("cy", function (d) {	 	return projection([+d[0], +d[1]])[1];})	
		.attr('transform', last_zoom_transform)
		.attr("r", radius)
		.style("opacity", 1)
		.style("fill", function(d){
			if(dl.dotHighlighted.includes(d[2]))
			return colors.getColorUniversityScatter();
			else
				return colors.getColorUniversity();
		})
		.style("opacity", 1);

	if(dl.countriesSelected.length == 0){
		svg_map.selectAll("path")
			 
			 .style("fill",colors.getBgMap())
			 .attr("stroke-width",1); //in pratica ogni path è un country*/

	}

	
	d3.selectAll("circle").on("mouseover",function(d,i){

		lat = d3.select(this).attr("lat");
		long = d3.select(this).attr("long");
		institution = d3.select(this).attr("uni");

		var universityOver= d3.select(this);

		tooltip.style("visibility", "visible")
			   .style("top", (d3.event.pageY) + "px")
			   .style("left", (d3.event.pageX + 10) + "px")
			   .html(institution);

	})
	.on("mouseout", function(d){
		tooltip.style("visibility", "hidden")
	})
}

function removeMap() {
	svg_map.selectAll("*").remove();
}

function arrNum(numero,nDecimali){
   var numero_arrotondato = Math.round(numero*Math.pow(10,nDecimali))/Math.pow(10,nDecimali);
   return numero_arrotondato;
 } 

 function arrayRemove(arr, value) { return arr.filter(function(ele){ return ele != value; });}

 dl.addListener("changeColor", function (e) {
    changeColorMap(true);
 });
 
 
 function changeColorMap(animate){
     var duration = 0;
     if (animate) duration = 300;
	 svg_map.selectAll(".map_path").transition().duration(duration).style("stroke", colors.getColorMarginCountry());
	 svg_map.selectAll(".map_path").transition().duration(duration).style("fill", colors.getBgMap());
 }


