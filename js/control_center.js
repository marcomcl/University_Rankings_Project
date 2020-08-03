function initGraphsStud(){
    initParallel();
    initMap();
    initBar();
    initScatter();
    initHeat();
    //initLegend();

}

function removeGraphsStud(){
    removeParallel();
    removeMap();
    removeBar();
    removeScatter();
    removeHeat();
}

function initGraphsTeacher(){
    initRadarChart();
    initLegend();
    initBar();
    initScatter();
    initConnected();
    initLollipop();
}

function removeGraphsTeacher(){
    removeRadarChart();
    removeBar();
    removeScatter();
    removeConnected();
    removeLollipop();
    removeLegend();

}

function updateGraphs(){
    //console.log("chiamato update dopo lifeCostChanged in control_center.js ");
    if(dl.student){
        updateParallel();
        updateMap();
        updateHeat();
    }
    updateBar();
    updateScatter();
    updateLollipop();
    updateConnected();
    updateLegend();
    updateRadarChart();
    //updateLollipop();
    
}

function updateFilteredGraphs(e){
    //console.log("chiamo update Filter Graphs");
   // updateHeat();
   // updateBar();
    //updateScatter();

    if(e.type == "parFilterChanged"){
        updateMap();
        updateHeat();
        updateBar();
        updateScatter();
    }
    else if(e.type == "mapFilterChanged"){
        updateHeat();
        updateBar();
        updateScatter();

    }
    else if(e.type == "cleanMap"){
        //updateMap();
         updateMap();
         updateBar();
         updateScatter();
    }
    else if(e.type == "yearChanged"){
        if(dl.student){
            updateMap();
            updateHeat();
            updateParallel();
        }else{
            updateRadarChart();
            updateLegend();
            updateLollipop();
            updateConnected();
        }
        updateBar();
        updateScatter();
        
        

        //console.log(dl.uniRadarChart);
    }
}

//catturo evento di brushing sullo scatter
/*function updateColorFilteredScatter(){
    updateParallel();
}*/

dl.addListener('scatterHighlightedChanged',function(e){
    if(dl.student){
        updateParallelByScatter();
        updateMap();
    }
    
});

dl.addListener('dataReady', function (e) {
    initGraphsStud();
});

dl.addListener('yearChanged', function (e) {
    //updateGraphs();
    console.log("chiamato cambio anno");
    //console.log(dl.uniRadarChart);
    updateFilteredGraphs(e);
});

dl.addListener('rankChanged', function (e) {

    updateGraphs();
});


dl.addListener('legendFilter', function (e) {
    updateConnected();
});

dl.addListener('lifeCostChanged', function (e) {
    console.log("chiamato lifeCostChanged in control_center.js");
    updateGraphs();
});

dl.addListener('parFilterChanged', function (e) {
    updateFilteredGraphs(e);
});

dl.addListener('mapFilterChanged', function (e) {
    
    updateFilteredGraphs(e);
});

dl.addListener("changeColor", function (e) {
    addColor(true);
 });

dl.addListener("cleanMap", function(e){
  
     updateFilteredGraphs(e);

});
 
 
 function addColor(animate){
     var duration = 0;
     if (animate) duration = 300;

     d3.select("body").transition().duration(duration).style("background-color", colors.getBackgroundColor());
     d3.select(".myHeader").transition().duration(duration).style("background-color", colors.getHeaderBackgroundColor());
     d3.select("#inner").transition().duration(duration).style("background-color", colors.getHeaderBackgroundColor());

     d3.selectAll("p").transition().duration(duration).style("color", colors.getTextColor());
     d3.selectAll("span").transition().duration(duration).style("color", colors.getTextColor());
 }
 
 d3.select(window).on("load", addColor);