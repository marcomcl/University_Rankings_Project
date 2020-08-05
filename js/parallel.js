clientWidth = document.documentElement.clientWidth;
clientHeight = document.documentElement.clientHeight;
var margin = { top: 30, right: 30, bottom: 10, left: 1 },
widthPar = Math.round(clientWidth * 0.56),
heightPar = Math.round(clientHeight * 0.40);

var svg_par = d3.select(".parallel_area").append("svg")
  .attr("width", '100%')
  .attr("height", '100%')
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var dataParallel;


function initParallel(){

    d3.select("div.tooltip_parallel").style("visibility", "hidden");

    dataParallel = getDataPar();

    countries = [];
      /////////////////////////////////////
    var legend = svg_par.selectAll('legend')
        .data(['university','selected from scatter'])
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', function (d, i) { return 'translate(530,' + i * 20 + ')'; });
/*
      legend.append('rect')
        .attr('x', width_scatter)
        .attr('width', 15)
        .attr('height', 15)
        .attr('class', 'legend_rect')
        .style('fill', function (d) { return colors.getColorUniversity()});

      legend.append('text')
        .attr('x', width_scatter - 2)
        .attr('y', 9)
        .attr('dy', '.25em')
        .style('text-anchor', 'end')
        .style("fill", colors.getColorUniversity())
        .text(function (d) { return d; });
*/



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
      .text(function (d) { return d; });






  ////////////////////////////////////////

    dimensions = ["cwur_score", "the_overall", "shg_score", "shg_score_on_alumni", "the_teaching"]
    names = ["Score [cwur]", "Score [the]", "Score [shg]", "Score on Alumni [shg]", "Teaching [the]"]
    var y = {}
    for (i in dimensions) {
    name = dimensions[i];
    if (name == "location") {
      countries = [" "];
      dataParallel.forEach(element => {
        if (!countries.includes(element[name])) {
          countries.push(element[name])
        }
      });
      countries.sort();
      countries.push("  ");
      y[name] = d3.scalePoint()
        .domain(countries)
        .range([0, heightPar]);
    }
    else
      y[name] = d3.scaleLinear()
        .domain( [0,100] )
        .range([heightPar, 0])
    }

    x = d3.scalePoint()
    .range([0, widthPar])
    .padding(1)
    .domain(dimensions);

    function path(d) {
      points = [];
      for (i in dimensions) {
        p = dimensions[i];
        if(!d[p] == '-' && !d[p] == "")
        points.push([x(p), y[p](0)]);
        else
          points.push([x(p), y[p](d[p])]);
      }
      return d3.line()(points);
    }

    background = svg_par.append("g")
    .attr("class", "background line")
    .selectAll("path")
    .data(dataParallel)
    .enter().append("path")
    .attr("d", path)
    .style("stroke", colors.parallelBG());

    foreground = svg_par.append("g")
    .attr("class", "foreground line")
    .selectAll("path")
    .data(dataParallel)
    .enter().append("path")
    .attr("d", path)
    .attr("institution", function(d){ return d["the_institution"];})
    .style("stroke", function(d){
      if(dl.dotHighlighted.includes(d["the_institution"])){
        d3.select(this).raise();
        return colors.parallelHighlight();
      }
      else {
        return colors.parallelNormal();
      }
    })
    .on("mouseover", highlight)
    .on("mouseleave", clearHighlight);

    //on mouseover
    function highlight(d){
      d3.select(this).raise();
      d3.selectAll(".line")
      .transition().duration(200)
      .style("opacity", "0.5")
      d3.select(this)
      .transition().duration(300)
      .style("stroke", colors.parallelHighlight())
      .style("opacity", "1.0")
      d3.select("div.tooltip_parallel")
      .style("visibility", "visible")
      .style("top", (d3.event.pageY) + "px")
      .style("left", (d3.event.pageX + 10) + "px")
      .html(d.institution);
      //console.log(d.institution);
    }
    //on mouseleace
    function clearHighlight(d){
      d3.select("div.tooltip_parallel").style("visibility", "hidden");
      d3.selectAll(".line")
      .transition().duration(200)
      .style("opacity", "1.0")

      d3.select(this)
      .transition().duration(200)
      .style("stroke", function(d){
        if(dl.dotHighlighted.includes(d["the_institution"]))
          return colors.parallelHighlight();
        else
          return colors.parallelNormal();
      }) 
    }

    var g = svg_par.selectAll("axis")
    .data(dimensions)
    .enter().append("g")
    .attr("class", "axis")
    .attr("transform", function (d) { return "translate(" + x(d) + ")"; })

  g.append("g")
    .attr("class", "axis")
    .each(function (d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -9)
    .text(function (d) { return names[dimensions.indexOf(d)]; })
    .style("fill", colors.getTextColor());

    axis = d3.selectAll(".axis");
    axis.selectAll("text").style("fill", colors.getTextColor());
    axis.selectAll("line").style("stroke", colors.getAxisColor());
    axis.select(".domain").style("stroke", colors.getAxisColor());

    g.append("g")
    .attr("class", "brush")
    .each(function (d) {
      d3.select(this).call(y[d].brush = d3.brushY().extent([[-8, 0], [8, heightPar]]).
        on("start", brushstart).
        on("brush", brush)).
        on("click", clear)
    })
    .selectAll("rect")
    .attr("x", -8)
    .attr("width", 16);

    function brushstart() {
      d3.event.sourceEvent.stopPropagation();
    }

    extents = dimensions.map(function (p) { return [0, 0]; });

    dl.filterPar = filterPar;
    function brush() {
      //console.log("chiamo brush");
      for (i in dimensions) {
        if (d3.event.target == y[dimensions[i]].brush) {
          extents[i] = d3.event.selection.map(y[dimensions[i]].invert, y[dimensions[i]]);
        }
      }
      dl.parFilter();
      foreground.style("display", function (d) {
        value = filterPar(d);
        if (value) {
          return null;
        }
        return "none";
      });
      updateParallelByScatter()
    }
    function filterPar(d) {
      //console.log("chiamo filterPar");
        value = dimensions.every(function (p, i) {
          if (extents[i][0] == 0 && extents[i][1] == 0) {
            return true;
          }
          else
            return extents[i][1] <= d[p] && d[p] <= extents[i][0];
        });
        return value;
      }

    function clear(){
      children = this.childNodes;
      hide = false;
      for (i = 0; i < children.length; i++) {
        if (children[i].__data__.type == 'selection' && children[i].y.animVal.value == 0) hide = true;
      }
    if (!hide) return;
      for (i in dimensions) {
        if (this.__data__ == dimensions[i]) {
          extents[i] = [0, 0];
          brush()
        }
      }
      dl.parFilter();
      updateParallelByScatter()
    }

    

}

function getDataPar(){
      return dl.data;
}

function updateParallel() {
    svg_par.selectAll("*").remove();
    initParallel();
}

function removeParallel() {
  svg_par.selectAll("*").remove();
}

function updateParallelByScatter(){
  svg_par.select(".foreground").selectAll("path")
    .style("stroke", function(d){
      if(dl.dotHighlighted.includes(d["the_institution"])){
        d3.select(this).raise();
        return colors.parallelHighlight();
      }
      else {
        return colors.parallelNormal();
      }
    })
}

dl.addListener("changeColor", function (e) {
  changeColorPar(true);
});


function changeColorPar(animate){
   var duration = 0;
   if (animate) duration = 300;
   axis = svg_par.selectAll(".axis")
   axis.selectAll(".domain").transition().duration(duration).style("stroke", colors.getAxisColor());
   axis.selectAll("line").transition().duration(duration).style("stroke", colors.getAxisColor());
   axis.selectAll("text").transition().duration(duration).style("fill", colors.getTextColor());
}