var curYear = 0;
var curRank = 0;
var curRankRec = 0;
var curLifeCost = 0;
function setYearRange(min, max){
    sel = document.getElementById("year");
    for (i = min; i<= max; i++){
        option = document.createElement('option');
        option.value = option.textContent = i;
        sel.appendChild(option);
    }

    sel.value = curYear = max;
    
    sel.addEventListener('change', function () {
        dl.changeYear(sel.value);
    });
}
//setto il rank range
function setRankRange(min, max){
    ran = document.getElementById("rank");
    ran.min = min;
    ran.max = max;
    ran.value = curRank = parseInt(max/2);
    ran.addEventListener('input', function () {
        dl.changeFilter(ran.value);
    });
    document.getElementById("top").innerHTML = "Top "+ curRank + " [cwur]";
}

function setRankRangeRec(min, max){
    ranrec = document.getElementById("rank_rector");
    ranrec.min = min;
    ranrec.max = max;
    ranrec.value = curRankRec = parseInt(max/2);
    ranrec.addEventListener('input', function () {
        //dl.changeFilter(ranrec.value);
    });
    document.getElementById("top_rec").innerHTML = "Top "+ curRank + " [cwur]";
}

function setLifeCostRange(min, max){
    //console.log("############## chiamato setLifeCostRange");
    lfc = document.getElementById("lifeCost");
    //console.log("############## ran vale:",lfc);
    lfc.min = min;
    lfc.max = max;
    lfc.value = curLifeCost = parseInt(max/2);
    //console.log("############## ran.value vale ",lfc.value);
    lfc.addEventListener('input', function () {
        //console.log("############## evento input");

        dl.changeFilterLifeCost(curRank,lfc.value);
    });
    document.getElementById("top2").innerHTML = "Life Cost: "+ curLifeCost + " [numbeo]";
}


function cleanMap(){


    dl.uniSelected.splice(0, dl.uniSelected.length);
    dl.countriesSelected.splice(0,dl.countriesSelected.length);
    dl.dotHighlighted.splice(0,dl.dotHighlighted.length);
    dl.cleanMap();

}



function switchUser()
{ 

    dl.student = !dl.student;

    if(!dl.student){


            removeGraphsStud();
            document.getElementById("bg").style.visibility = "visible";
            dl.keyLegend.splice(0,dl.keyLegend.length);

    }else{

            dl.university = "";
            dl.coloreUniversityRector = "";
            document.getElementById("uni").value = "";
            removeGraphsTeacher();
            initGraphsStud();

            document.getElementById("clear_area").style.visibility = "visible";
            document.getElementById("legend").style.display = "none";
            document.getElementById("map").style.display = "block";
            document.getElementById("radar").style.display = "none";
            document.getElementById("parallel").style.display = "block";
            document.getElementById("heat").style.display = "block";
            document.getElementById("connected").style.display = "none";
            document.getElementById("lollipop").style.display = "none";
            document.getElementById("bg").style.visibility = "hidden";
            document.getElementById("slider").style.display = "block";
            document.getElementById("slider_rec").style.display = "none";
            document.getElementById("slider2").style.visibility = "visible";


            //svuoto la legenda
            dl.keyLegend.splice(0,dl.keyLegend.length);

            document.getElementById("title_rector").innerHTML = ""; 


   



    }
}

function initTeacher(){
    //console.log("chiamato teacher");
    //manageTeacherStuffs();
    dl.initDataForRector();

    dl.initUniData();
    dl.initUniDataConnected();

    initGraphsTeacher();
    
    document.getElementById("clear_area").style.visibility = "hidden";
    document.getElementById("map").style.display = "none";
    document.getElementById("radar").style.display = "block";
    document.getElementById("parallel").style.display = "none";
    document.getElementById("lollipop").style.display = "block";
    document.getElementById("heat").style.display = "none";
    document.getElementById("connected").style.display = "block"; 
    document.getElementById("legend").style.display = "block";
    document.getElementById("bg").style.visibility = "hidden";
    document.getElementById("slider").style.display = "none";
    document.getElementById("slider_rec").style.display = "block";
    document.getElementById("slider2").style.visibility = "hidden";


    //span = document.getElementById("title_rector");
    //txt = document.createTextNode(dl.university);
    //span.appendChild(txt);

    document.getElementById("title_rector").innerHTML = "<b>"+dl.university+"</b>"; 

    dl.numberOfUniInCountry = dl.universityDelPaeseDellaMiaScelta.length;
    //document.getElementById("top").innerHTML = "Top " + 0 + " /"+dl.numberOfUniInCountry;




}

function addUniToSelect(uni){
    sel = document.getElementById("uni");
    option = document.createElement('option');
    option.value = option.textContent = uni;
    //console.log(uni);
    sel.appendChild(option);
}
