var curYear = 0;
var curRank = 0;
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
            document.getElementById("slider").style.visibility = "visible";
            document.getElementById("slider2").style.visibility = "visible";


            //svuoto la legenda
            dl.keyLegend.splice(0,dl.keyLegend.length);

            document.getElementById("title_rector").innerHTML = ""; 


   



    }
}

function initTeacher(){
    //console.log("chiamato teacher");
    manageTeacherStuffs();

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
    //document.getElementById("slider").style.visibility = "hidden";

    document.getElementById("slider2").style.visibility = "hidden";


    //span = document.getElementById("title_rector");
    //txt = document.createTextNode(dl.university);
    //span.appendChild(txt);

    document.getElementById("title_rector").innerHTML = "<b>"+dl.university+"</b>"; 

    dl.numberOfUniInCountry = dl.universityDelPaeseDellaMiaScelta.length;
    document.getElementById("top").innerHTML = "Top " + 0 + " /"+dl.numberOfUniInCountry;




}

function addUniToSelect(uni){
    sel = document.getElementById("uni");
    option = document.createElement('option');
    option.value = option.textContent = uni;
    //console.log(uni);
    sel.appendChild(option);
}


function manageTeacherStuffs(){


    //console.log("entrato in manageTeacherStuffs");
     dl.university  = document.getElementById("uni").value;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //prelevo il paese

    //console.log("data in initTeacher -> ",dl.data);
    //console.log(" dl.university -> ", dl.university);

    var mia_uni = null;
    //var indice_di_range = null;

    //mi prendo il paese di quella università
    for( el in dl.data){
        if(dl.data[el].the_institution == dl.university){
            
            dl.universityCountry = dl.data[el].the_country;
            dl.universityRank = dl.data[el].the_rank;
            mia_uni = dl.data[el];

        }
    }


    //mia università

    dl.universityDelPaeseDellaMiaScelta.splice(0,dl.universityDelPaeseDellaMiaScelta.length);

    //console.log("UTIL.JS dl.data",dl.data);
    //riempio universityDelPaeseDellaMiaScelta
    //console.log("from utils: ",dl.universityDelPaeseDellaMiaScelta);
     for( el in dl.data){

        if(dl.data[el].the_country == dl.universityCountry){
            dl.universityDelPaeseDellaMiaScelta.push(dl.data[el]);
            dl.USED_universityDelPaeseDellaMiaScelta.push(dl.data[el]);
        }
     }

     //di questo prendo il range di 10 che caratterizzano l'uni del rettore

     /*dl.indice_di_range = dl.universityDelPaeseDellaMiaScelta.indexOf(mia_uni);
     //console.log("index: ", dl.indice_di_range);

     //ar2 = [];
     if(dl.indice_di_range < 10){

        dl.universityDelPaeseDellaMiaScelta = dl.universityDelPaeseDellaMiaScelta.slice(0, 10);
        dl.USED_universityDelPaeseDellaMiaScelta = dl.USED_universityDelPaeseDellaMiaScelta.slice(0, 10);

     }
     else if(dl.indice_di_range >= 10){
       dl.universityDelPaeseDellaMiaScelta = dl.universityDelPaeseDellaMiaScelta.slice(dl.indice_di_range-10, indice_di_range);
        dl.USED_universityDelPaeseDellaMiaScelta = dl.USED_universityDelPaeseDellaMiaScelta.slice(dl.indice_di_range-10, indice_di_range);


     }*/

    dl.coordinatesPCATeacher.splice(0,dl.coordinatesPCATeacher.length);


    for( i in dl.universityDelPaeseDellaMiaScelta){
         institution = dl.universityDelPaeseDellaMiaScelta[i].the_institution;
         pca_1 = dl.universityDelPaeseDellaMiaScelta[i].PCA_component3;
         pca_2 = dl.universityDelPaeseDellaMiaScelta[i].PCA_component4;
         //console.log("bellaaaaaaaa ",String(institution),parseFloat(pca_1),parseFloat(pca_2));
        dl.coordinatesPCATeacher.push([String(institution),parseFloat(pca_1),parseFloat(pca_2)]);


    }



}
