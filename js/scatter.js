clientWidth = document.documentElement.clientWidth;
clientHeight = document.documentElement.clientHeight;

var margin = {top: 40, right: 60, bottom: 10, left: 60},
    width_scatter = Math.round(clientWidth * 0.35) - margin.left - margin.right,
    height_scatter = Math.round(clientHeight * 0.35) - margin.top - margin.bottom;

var svg_scatter = d3.select(".scatterplot_area").append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
  .append("g")
  .attr("transform", "translate(" + margin.left  + "," + margin.top + ")")
  .on("dblclick", function(){
    dl.dotHighlighted.splice(0, dl.dotHighlighted.length);
    dl.scatterFilter();
  })

//read the data

function initScatter(){

        /////////////////////////////////////
    /*
    data_legend = [];

    if (dl.student == true) data_legend = ['university','selected', 'selected from scatter'];
    else{
      data_legend = ['university'];
    }

    var legend = svg_scatter.selectAll('legend')
        .data(data_legend)
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', function (d, i) { return 'translate(-200,' + i * 20 + ')'; });

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



  ////////////////////////////////////////

   // d3.csv("./PCA/datasetConPCA.csv", function (data) {
  dataScatter = getDataScatter();

  //console.log(dataScatter);

  k = d3.keys(dataScatter[0]).filter(function(d){return d;});

  var x = d3.scaleLinear()
    .domain([-5, 11])
    .range([ 0, width_scatter ])//unit : pixels
    //.nice()
  var xAxis = svg_scatter.append("g")
    .attr("transform", "translate(0," + height_scatter + ")")
    .attr("class", "xAxis")
    .call(d3.axisBottom(x));

  var y = d3.scaleLinear()
    .domain([15, -2])
    .range([ 0, height_scatter])//unit: pixels
    .nice()

  var yAxis = svg_scatter.append("g")
    .attr("class", "yAxis")
    .call(d3.axisLeft(y));

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

  // Add X axis label:
  svg_scatter.append("text")
      .attr("text-anchor", "end")
      .attr("x", width_scatter/2 + margin.left)
      .attr("y", height_scatter + margin.top + 10)
      .attr("stroke", "black")
      .text("PCA component 1");

  // Y axis label:
  svg_scatter.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 30)
      .attr("x", -margin.top + height_scatter/10 + 10)
      .attr("stroke", "black")
      .text("PCA component 2");


  d3.select("div.tooltip_scatter").style("visibility", "hidden");

  var clip = svg_scatter.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width_scatter )
      .attr("height", height_scatter )
      .attr("x", 0)
      .attr("y", 0);


  var brush = d3.brush()             
    .extent( [ [0,0], [width_scatter,height_scatter] ] )
    .on("end", updateChart)
    //.on("start brush", highlight);

  //

  var scatter = svg_scatter.append('g')
    .attr("clip-path", "url(#clip)")
  //

  scatter 
    .append("g")
      .attr("class", "brush")
      .call(brush);
  //
  //data = getDataScatter();
  //console.log(data);
  //data = dl.uniCoordinates;

  //console.log("data PCA: ",data);

  var tooltip = d3.select("div.tooltip_scatter");
  //console.log("dl.uniRadarChart",dl.uniRadarChart);
  //add the dots
  var myCircle =  scatter.append('g')
    .selectAll("circle")
    .data(dataScatter)
    .enter()
    .append("circle")
      .attr('class','universita') 
      .attr("uni",     function(d){return d[0];})
      //.attr("country", function(d){return d[3];})
      .attr("cx", function (d) { return x(d[1]); } )
      .attr("cy", function (d) { return y(d[2]); } )
      //.attr("cx", function (d) { return d.PCA_component1; } )
      //.attr("cy", function (d) { return d.PCA_component2; } )
      .attr("r", 3)
      .style("fill", colors.colorScatter())
      .style("opacity", function (d) {

              if(dl.student)return 0.5;

              if(!dl.student){
                return 1;
              }
      })
      .on("mouseover",function(){

            var uni = d3.select(this).attr("uni");
            //var paeseId = id.attr("id");

            tooltip.style("visibility", "visible")
            .style("top", (d3.event.pageY) + "px")
            .style("left", (d3.event.pageX + 10) + "px")
            .html(uni);

      })
      .on("mouseleave", function(){
        tooltip.style("visibility", "hidden");
        // console.log("entrato in mouseLeave");

      })
      //.on("mousedown",  mouseDown())
  var idleTimeout;
  //

  function idled() { idleTimeout = null; }

function highlight(){
  dl.dotHighlighted.splice(0, dl.dotHighlighted.length);
  //console.log("dot highlighted ", dl.dotHighlighted);
  myCircle.classed("selected", 
                  function(d){ 
                    

                    if(isBrushed(extent, x(d[1]), y(d[2]) ) ) {
                        dl.dotHighlighted.push(d[0]);
                        return false;
                    }else{
                        return false;
                    }

  });
}

function updateChart() {

      extent = d3.event.selection
      //console.log("extent vale: ",String(extent));
      if(!extent){
        //
        if (!idleTimeout)
          return idleTimeout = setTimeout(idled, 350);
        
        x.domain([-5,11])
        y.domain([15, -2])
      }else{
        highlight();
        x.domain([ x.invert(extent[0][0]), x.invert(extent[1][0])])
        y.domain([ y.invert(extent[0][1]), y.invert(extent[1][1])])
       
        //console.log("chiamo brus on updateChart");
        //attribuisco a quelli nel brush l'attributo selected e aggiungo quelle selected in dl.dotHighlighted
        //dl.dotHighlighted viene usato dalla mappa e dal parallel per evidenziare le università scelte
        //console.log("dot highlighted ", dl.dotHighlighted);
        scatter.select(".brush").call(brush.move, null) 
        //comunico che ho brushato dei punti
        dl.scatterFilter(); 

      }

      // update axis and circle position
      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      yAxis.transition().duration(1000).call(d3.axisLeft(y))
      scatter
        .selectAll("circle")
        .transition().duration(1000)
        .attr("cx", function (d) {  return x(d[1]); } )
        .attr("cy", function (d) {  return y(d[2]); } )

      changeColorScatter(false);
}


  // A function that return TRUE or FALSE according if a dot is in the selection or not
  function isBrushed(brush_coords, cx, cy) {
        var x0 = brush_coords[0][0],
            x1 = brush_coords[1][0],
            y0 = brush_coords[0][1],
            y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
  }


  //

  //
// })
}



function updateScatter() {

  //console.log("chiamato updateScatter");
   svg_scatter.selectAll("*").remove();
   initScatter();
}

function removeScatter() {
  svg_scatter.selectAll("*").remove();
}

function getDataScatter(){
  if(dl.student)
    return dl.coordinatesPCA;
  else
    return dl.coordinatesPCATeacher;
}

dl.addListener("changeColor", function (e) {
    changeColorScatter(true);
 });
 
 
 function changeColorScatter(animate){
    var duration = 0;
    if (animate) duration = 300;
    
    svg_scatter.selectAll(".domain").transition().duration(duration).style("stroke", colors.getTextColor());
    svg_scatter.selectAll("line").transition().duration(duration).style("stroke", colors.getTextColor());
    svg_scatter.selectAll("text").transition().duration(duration).style("fill", colors.getTextColor());
 }
