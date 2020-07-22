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

  // disegna asse delle x con le specifiche indicate
  var x = d3.scaleBand()
    .range([ 0, width_heatmap ])
    .domain(features)
    .padding(0.01);
  svg_heatmap.append("g")
    .attr("transform", "translate(0," + height_heatmap + ")")
    .call(d3.axisBottom(x))
    .select(".domain").remove() //non mostrare asse delle x sotto
    .selectAll("text")
    .style("font-size", 10)
      .style("text-anchor", "start")
      .attr("transform", "rotate(-65)" );
      //.attr("transform", "rotate(-65)" );

   svg_heatmap.selectAll("text")
      .style("font-size", 10)
      .style("text-anchor", "start")
      .attr("transform", "rotate(15)" );

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
    const color = d3.scaleSequential(d3.interpolateGreens)
      .domain([d3.min(dataHeat, d => +d[feature]), d3.max(dataHeat, d => +d[feature])])
    svg_heatmap.selectAll(`rect.ind-${i}`)
    .data(dataHeat)
    .enter().append('rect')
      .classed(`ind-${i}`, true)
      .attr('x', d => x(feature))
      .attr('y', d => y(d.the_institution))
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('fill', d => color(+d[feature]))
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