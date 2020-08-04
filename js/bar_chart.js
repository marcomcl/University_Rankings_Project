clientWidth = document.documentElement.clientWidth;
clientHeight = document.documentElement.clientHeight;
var margin = { top: 17, right: 10, bottom: 0, left: 170 },
    widthBar = Math.round(clientWidth * 0.27),
    heightBar = Math.round(clientHeight * 0.31);

var svg_bar = d3.select(".bar_area")
    .append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

function initBar(){

    dataBar = getDataBar();

    //console.log(dataBar);

    var dict = {};

    for(i in dataBar){
        k = dataBar[i].institution;
        dict[k] = dataBar[i].cwur_score;
    }

    var elements = Object.keys(dict).map(function (key) {
        return [key, dict[key]];
    });

    elements.sort(function(a,b){
        return b[1] - a[1];
    });

    var top_10_scores = (elements.length >= 10) ? elements.slice(0, 10) : elements;

    var top_10_uni = [];

    for(i in top_10_scores){
        top_10_uni.push(top_10_scores[i][0]);
    }

    // add x-axis

    var x = d3.scaleLinear()
        .domain([0, 100])
        .range([0, widthBar]);

    x_bar = svg_bar.append("g")
    .attr("class", "x_bar_chart")
    .attr("transform", "translate(0," + heightBar + ")")
    //.text("Stock Price")
    .call(d3.axisBottom(x));
    /*.append("text")
         .attr("transform", "traslate(0,10)")
         //.attr("y", 6)
         .attr("dy", "-5.1em")
         .attr("text-anchor", "end")
         .attr("stroke", "black")
         .text("Stock Price");*/




    x_bar.selectAll("text")
        .attr("transform", "translate(2,0)")
        .style("text-anchor", "middle")
        .style("fill", colors.getTextColor())
        .style("font-size", "10px");

    x_bar.selectAll("line")
        .style("stroke", colors.getAxisColor());

    x_bar.select(".domain")
        .style("stroke", colors.getTextColor());

    // add y-axis

    var y = d3.scaleBand()
    .range([0, heightBar])
    .domain(top_10_uni)
    .padding(.1);

    y_bar = svg_bar.append("g")
        .attr("class", "y_bar_chart")
        .call(d3.axisLeft(y));

    y_bar.selectAll("text")
        .attr("class", "text_bar")
        .attr("transform", "translate(-1,-5)rotate(-30)")
        .style("text-anchor", "end")
        .style("fill", colors.getTextColor())
        .style("font-size", "10px");

    y_bar.selectAll("line")
        .style("stroke", colors.getAxisColor());

    y_bar.select(".domain")
        .style("stroke", colors.getTextColor());
   
    // bars

     svg_bar.append("text")
      .attr("text-anchor", "end")
      .attr("x", widthBar/2 + margin.left)
      .attr("y", heightBar + margin.top + 15)
      .attr("stroke", "black")
      .text("cwur score");

    svg_bar.selectAll("rect")
        .data(top_10_scores)
        //.data(elements)
        .enter()
        .append("rect") //appendo le singole barre
        .attr("class", "bar_rect")
        .attr("x", x(0))
        .attr("y", function (d) { return y(d[0]); })
        .attr("width",function(d){    return 0; })
        .attr("height", y.bandwidth())
        .attr("fill", function(d){
            //console.log("d vale ",d);
            if(!dl.student && d[0] == dl.university){
                 // return colors.barChartUni();
                //console.log("d vale ",d);
                //console.log("--------------------->",dl.coloreUniversityRector);
                return  dl.coloreUniversityRector;
            }
            else{
                //return dl.coloreUniversityRector;
                return colors.barChart();
            }
        })
        .attr("transform","translate(1,0)")
        .transition()
        .duration(800)
        .delay(function(d,i){return(i*100)});


    //animation
    svg_bar.selectAll("rect")
        .transition()
        .duration(600)
        .attr("width", function(d) { return x(d[1]);})
        .delay(function(d,i){ return(i*100)})
}   

function updateBar(){
    svg_bar.selectAll("*").remove();
    initBar();
}

function removeBar() {
    svg_bar.selectAll("*").remove();
}

function getDataBar(){
    if(dl.student)
        return dl.filteredPar;
    else
        return dl.universityDelPaeseDellaMiaScelta;
}

dl.addListener("changeColor", function (e) {
    changeColorBar(true);
 });
 
 
 function changeColorBar(animate){
     var duration = 0;
     if (animate) duration = 300;
     svg_bar.selectAll(".domain").transition().duration(duration).style("stroke", colors.getAxisColor());
     svg_bar.selectAll("line").transition().duration(duration).style("stroke", colors.getAxisColor());
     svg_bar.selectAll("text").transition().duration(duration).style("fill", colors.getTextColor());
 }