var width = 300,
  height = 300;

// Config for the Radar chart
var config = {
  w: width,
  h: height,
  maxValue: 100,
  levels: 5,
  ExtraWidthX: 300
}

data = [
[
{"area": "Central ", "value": 80},
{"area": "Kirkdale", "value": 40},
{"area": "Kensington ", "value": 40},
{"area": "Everton ", "value": 90},
{"area": "Picton ", "value": 60}

],

[
{"area": "Central ", "value": 100},
{"area": "Kirkdale", "value": 40},
{"area": "Kensington ", "value": 100},
{"area": "Everton ", "value": 90},
{"area": "Picton ", "value": 60}

]
]
clientWidth = document.documentElement.clientWidth;
clientHeight = document.documentElement.clientHeight;


var margin_radar = { top: -60, right: 10, bottom: 10, left: -20 },
    width_radar = Math.round(clientWidth * 0.25),
    height_radar = Math.round(clientHeight * 0.32);

var svg_radar = d3.select(".radar_area")
        //.selectAll('svg')
        .append('svg')
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

    let data2 = [];
    let features = ["teaching", "research","citations","international_outlook","income"]; //features del THE
    //generate the data
    for (var i = 0; i < 3; i++){
        var point = {} // creo un object pount
        //each feature will be a random number from 1-9
        features.forEach(f => point[f] = 1 + Math.random() * 8);
        //features.forEach(f => point[f] = )
        data2.push(point);
    }
    //console.log("data  -> ",data2);

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
    
    //console.log("dataRadarPaeseSelected--> ",dataRadarPaeseSelected);

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

    //console.log("dataPoints: ",dataPoints);



    //let features = ["teaching", "research","citations","international_outlook","income"]; //features del THE
    /*

      data = [
     [
      {"area": "Central ", "value": 80},
      {"area": "Kirkdale", "value": 40},
      {"area": "Kensington ", "value": 40},
      {"area": "Everton ", "value": 90},
      {"area": "Picton ", "value": 60}
    
     ],

      [
      {"area": "Central ", "value": 100},
      {"area": "Kirkdale", "value": 40},
      {"area": "Kensington ", "value": 100},
      {"area": "Everton ", "value": 90},
      {"area": "Picton ", "value": 60}
    
     ]
       ]*/
    var keysLegend = [];
    //let colors_radar = ["darkorange", "gray", "navy","blue", "green","yellow", "white","red","purple","brown"];

    data_new = [];
    for( i in  dataPoints){
      //console.log("dataPoints  ", dataPoints[i]);
      //console.log("dataPoints[teaching ] ",dataPoints[i].teaching);
      teaching_new = dataPoints[i].teaching;
      research_new = dataPoints[i].research;
      citations_new = dataPoints[i].citations;
      international_outlook_new = dataPoints[i].international_outlook;
      income_new = dataPoints[i].income;

      //console.log(teaching_new," ",research_new," ",citations_new," ",international_outlook_new," ",income_new) ;
      data_new.push(
         [
      {"area": "teaching ", "value": teaching_new},
      {"area": "reseach", "value": research_new},
      {"area": "citations ", "value": citations_new},
      {"area": "international_outlook ", "value": international_outlook_new},
      {"area": "income ", "value": income_new}
    
     
        ]);
      //let color = colors_radar[i];
      instance = dataPoints[i]
     // dl.uniRadarChart.push(    [String(instance["university"]), color]     ); 
      dl.keyLegend.push(String(instance["university"]));
      keysLegend.push(String(instance["university"]));
      //aggiunta relativa a legenda

    }

    console.log("keysLegend -> ",  dl.keyLegend);



    //console.log("mentre data vale : ",data);
    //console.log("e data_new vale : ",data_new);


     //////////////////////////////////////////////////////////////////////////////////////
        RadarChart.draw("#radar", data_new, config,keysLegend);

}


var RadarChart = {




  draw: function(id, d, options,keysLegend){

    var cfg = {
     radius: 7,
     w: 600,
     h: 600,
     factor: 1,
     factorLegend: 1,
     levels: 3,
     maxValue: 0,
     radians: 2 * Math.PI,
     opacityArea: 0,
     ToRight: 5,
     TranslateX: 80,
     TranslateY: 30,
     ExtraWidthX: 100,
     ExtraWidthY: 100,
     //color: d3.scaleOrdinal().range(["#6F257F", "#CA0D59"])

     color : d3.scaleOrdinal().domain(keysLegend).range(d3.schemeTableau10)


    };
    console.log("color: ",cfg.color);
    if('undefined' !== typeof options){
      for(var i in options){
      if('undefined' !== typeof options[i]){
        cfg[i] = options[i];
      }
      }
    }
    
    cfg.maxValue = 100;
    //console.log("d[0] vale ",d[0])
   // var allAxis = (d[0].map(function(i, j){return i.area}));
    var allAxis = ["teaching", "research","citations","international_outlook","income"]; //features del THE
   // console.log("allAxis ",allAxis);
    var total = allAxis.length;
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    var Format = d3.format('%');
    d3.select(id).select("svg").remove();

    var g = d3.select(id)
        .append("svg")
        .attr("width", cfg.w+cfg.ExtraWidthX)
        .attr("height", cfg.h+cfg.ExtraWidthY)
        .append("g")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

    var tooltip;
  
    //Circular segments
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data(allAxis)
       .enter()
       .append("svg:line")
       .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
       .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
       .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
       .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
       .attr("class", "line")
       .style("stroke", "grey")
       .style("stroke-opacity", "0.75")
       .style("stroke-width", "0.3px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
    }

    //Text indicating at what % each level is
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data([1]) //dummy data
       .enter()
       .append("svg:text")
       .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
       .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
       .attr("class", "legend")
       .style("font-family", "sans-serif")
       .style("font-size", "10px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
       .attr("fill", "#737373")
       .text((j+1)*100/cfg.levels);
    }

    series = 0;

    var axis = g.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
      .attr("x1", cfg.w/2)
      .attr("y1", cfg.h/2)
      .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
      .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "1px");

    axis.append("text")
      .attr("class", "legend")
      .text(function(d){return d})
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("transform", function(d, i){return "translate(0, -10)"})
      .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
      .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

 
    d.forEach(function(y, x){
      dataValues = [];
      g.selectAll(".nodes")
      .data(y, function(j, i){
        //console.log("j vale -----------> ",j);
        dataValues.push([
        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
        ]);
      });
      dataValues.push(dataValues[0]);
      //console.log("-> dataValues vale: ",dataValues);
      g.selectAll(".area")
             .data([dataValues])
             .enter()
             .append("polygon")
             .attr("class", "radar-chart-serie"+series)
             .attr("uni",keysLegend[series])
             .style("stroke-width", "2px")
             .style("stroke", cfg.color(keysLegend[series]))
             .attr("points",function(d) {
               var str="";
               for(var pti=0;pti<d.length;pti++){
                 str=str+d[pti][0]+","+d[pti][1]+" ";
               }
               return str;
              })
             .style("fill", function(j, i){console.log("CFG keys-> ",keysLegend[series]);return cfg.color(series)})
             .style("fill-opacity", cfg.opacityArea);

      
      series++;
      console.log("series : ", series);
    });
    series=0;


var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    d.forEach(function(y, x){
      g.selectAll(".nodes")
      .data(y).enter()
      .append("svg:circle")
      .attr("class", "radar-chart-serie"+series)
      .attr("uni",keysLegend[series])
      .attr('r', cfg.radius)
      .attr("alt", function(j){return Math.max(j.value, 0)})
      .attr("cx", function(j, i){
        dataValues.push([
        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
      ]);
      return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
      })
      .attr("cy", function(j, i){
        return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
      })
      .attr("data-id", function(j){return j.area})
      .style("fill", "#fff")
      .style("stroke-width", "2px")
      .style("stroke",cfg.color(keysLegend[series])).style("fill-opacity", .9)
      .on('mouseover', function (d){
        //console.log(d.area)
          console.log("nome uni",d3.select(this).attr("uni"));
          var università = d3.select(this).attr("uni");
            tooltip
              .style("left", d3.event.pageX - 40 + "px")
              .style("top", d3.event.pageY - 80 + "px")
              .style("display", "inline-block")
              .html(università+"<br>"+(d.area) + "<br><span>" + (d.value) + "</span>");
            })
        .on("mouseout", function(d){ tooltip.style("display", "none");});

      series++;
    });
    }
};



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