clientWidth = document.documentElement.clientWidth;
clientHeight = document.documentElement.clientHeight;

// set the dimensions and margins of the graph
var margin = {top: 40, right: 20, bottom: 10, left: 200},
    width_heatmap = Math.round(clientWidth * 0.27) - margin.left - margin.right,
    height_heatmap = Math.round(clientHeight * 0.27) - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg_heatmap = d3.select(".heatmap_area").append("svg")
   .attr("width", '100%')
   .attr("height", '100%')
  .append("g")
   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Read the data
function initHeat(){

          /////////////////////////////////////
    data_legend = ["min","avg","max","novalue"];
     const color = d3.scaleSequential(d3.interpolateGreens)
      .domain([0,100]);
  
    var legend = svg_heatmap.selectAll('legend')
        .data(["min","avg","max","novalue"])
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', function (d, i) { return 'translate(80,' + i * 20 + ')'; });
        //.attr('transform', function (d, i) { console.log("i vale :" ,i);return 'translate(-400,'+10+i*20+')'; });

      legend.append('rect')
        .attr('x', width_heatmap)
        .attr('width', 15)
        .attr('height', 15)
        .attr('class', 'legend_rect')
        .style('fill', function (d) { 

          if(d == "min"){
            return color(0);
          }
          else if(d == "avg"){
            return color(50);
          }
          else if(d == "max"){
            return color(100);
          }
          else{

            return "black";

          }

        });






  /////////////////////////////////////////

  dataHeat = getDataHeat();

  // Labels of row and columns
  var features = ["the_reseach", "the_citations", "cwur_research_performance", "cwur_citations", "shg_score_on_pub", "shg_score_on_HiCi"]
  var names = ["Research [the]", "Citations [the]", "Research [cwur]", "Citations [cwur]", "Score on Pub. [shg]", "Score on HiCi [shg]"]

  var dict = {};

    for(i in dataHeat){
        k = dataHeat[i].institution;
        dict[k] = dataHeat[i].cwur_score;
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

    //////////////////////////////////////////////////////////////////////////////////

 // create a tooltip
  var tooltipHeat = d3.select("#heat")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    tooltipHeat.style("opacity", 1)
  }
  var mousemove = function(d) {

    //console.log("d vale :", d);
    value_rect = d3.select(this).attr("datum");
    attr_value_rect = d3.select(this).attr("feature");
    //console.log("d3.select(this); ",d3.select(this).attr("datum"));
    tooltipHeat
      .html(attr_value_rect+ " : " + value_rect)
      .style("top", (d3.event.pageY) + "px")
      .style("left", (d3.event.pageX + 10) + "px");
    
  }
  var mouseleave = function(d) {
    tooltipHeat.style("opacity", 0)
  }




  //////////////////////////////////////////////////////////////////////////////////


  // disegna asse delle x con le specifiche indicate
  var x = d3.scaleBand()
    .range([ 0, width_heatmap ])
    .domain(features)
    .padding(0.01);
  svg_heatmap.append("g")
    .attr("transform", "translate(0," + height_heatmap + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove(); //non mostrare asse delle x sotto
    /*.selectAll("text")
    .style("font-size", 10)
      .style("text-anchor", "start")
      .attr("transform", "rotate(-65)" );
      //.attr("transform", "rotate(-65)" );*/
  
   svg_heatmap.selectAll("text")
      .style("font-size", 10)
      .style("text-anchor", "start")
      .attr("transform", "translate(7,5)" + "rotate(15)");
      //.attr("transform", "rotate(15)" );

    legend.append('text')
        .attr('x', width_heatmap - 2)
        .attr('y', 9)
        .attr('dy', '.25em')
        .style('text-anchor', 'end')
        .style("fill", colors.getColorUniversity())
        .text(function (d) { /*console.log(d);*/return d; });

        //x.tickSizeOuter(0);
  // disegna asse delle y con le specifiche indicate
  var y = d3.scaleBand()
    .range([height_heatmap, 0 ])
    .domain(institutions)
    .padding(0.01);

  svg_heatmap.append("g")
    //.style("font-size", 8)
    .call(d3.axisLeft(y))
    .select(".domain").remove() //non mostrare asse delle y a sinistra

  svg_heatmap.selectAll(".domain").style("stroke", colors.getTextColor());
  svg_heatmap.selectAll("line").style("stroke", colors.getTextColor());
  svg_heatmap.selectAll("text").style("fill", colors.getTextColor());



  features.forEach((feature, i) => {
    

   

    //console.log([d3.min(dataHeat, d => +d[feature]), d3.max(dataHeat, d => +d[feature])])
    svg_heatmap.selectAll(`rect.ind-${i}`)
    .data(dataHeat)
    .enter().append('rect')
      .classed(`ind-${i}`, true)
      //.attr('x', d => x(feature))
      .attr('x', function(){

        if(i == 3 || i == 2) return x(feature)+15;
        if(i == 5 || i == 4) return x(feature)+30;
        else{
          //console.log(i);
          //console.log(x(feature));
          return x(feature); 
          }      
        
      } )
      .attr('y', d => y(d.the_institution))
      .attr('rx', 8)
      .attr('rx', 8)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('datum',d => d[feature])
      .attr('feature',feature)
      .attr('fill', d => color(+d[feature]))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    })



}

function updateHeat() {
   svg_heatmap.selectAll("*").remove();
   initHeat();
}

function removeHeat() {
  svg_heatmap.selectAll("*").remove();
}

function getDataHeat(){
    return dl.filteredPar;
}

dl.addListener("changeColor", function (e) {
  changeColorHeat(true);
});


function changeColorHeat(animate){
  var duration = 0;
  if (animate) duration = 300;
  
  svg_heatmap.selectAll(".domain").transition().duration(duration).style("stroke", colors.getTextColor());
  svg_heatmap.selectAll("line").transition().duration(duration).style("stroke", colors.getTextColor());
  svg_heatmap.selectAll("text").transition().duration(duration).style("fill", colors.getTextColor());
}