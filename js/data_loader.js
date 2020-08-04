//Caricamento e salvataggio dati

//dl is the data loader

DataLoader  = function(){
    this.data = [];
    this.allData = []; //qui finiscono tutti i dati
    this.keys = [];
    this.listeners = new EventTarget();
    this.loadingOk = false;
    this.filteredPar = [];
    this.filterPar = undefined;
    this.universities = [];
    this.pca = [];
    //paesi selezionati nella mappa
    this.countriesSelected = [];
    //università selezionate (per anno o altro, da valutare)
    this.uniCoordinates = [];
    //università selezionate dalla mappa
    this.uniSelected = [];
    //università paesi selezionati //es:clicco un paese, ottengo direttamente tutte le università di quel paese
    this.countryUniSelected = [];
    //paesi senza lat e longitude
    this.uniNoLatLong = [];
    //
    this.coordinatesPCA = [];
    //
    this.selectedPCA = [];
    //Università filtrate sullo scatter
    this.dotHighlighted = [];

    this.uniRadarChart = [];

    //Università del Rettore
    this.university = "";
    this.uniData = [];

    //Per cambiare modalità
    this.student = true;
    this.universityDelPaeseDellaMiaScelta = [];
    this.USED_universityDelPaeseDellaMiaScelta = [];

    this.universityCountry = "";
    this.universityRank = "";
    this.coordinatesPCATeacher = [];


    //legenda
    this.keyLegend = [];
    //colori assegnati dal radar
    this.colorsRadar = [];

    this.indice_di_range = null;

    this.coloreUniversityRector = "";

    this.uniDataConnected = [];
    //per il filtraggio dalla legenda in modalita rettore
    this.numberOfUniInCountry = 0;
    this.cliccateInLegenda = [];
}

//year_Selezionato = 2019;

DataLoader.prototype.loadData = function(){
    obs = this;

    //only these needed

    //by mike to apply lat and long
    //il file completo è latLongCountry, èusato  è per la prova dei colori (vedi universityUSA sopra)
    //latLong li contiene tutti
   // d3.csv("./dataset/provaLatLong.csv", function (csvData) {

    //funzione per arrotondare a 3 cifre decimali
    function arrNum(numero,nDecimali){
       var numero_arrotondato = Math.round(numero*Math.pow(10,nDecimali))/Math.pow(10,nDecimali);
       return numero_arrotondato;
     } 

   // d3.csv("./PCA/datasetPerMap.csv", function (csvData) {
   //d3.csv("./PCA/tcs2018_7thJuly.csv", function (csvData) {

   // d3.csv("./PCA/tcsLatLong/tcsLatLong2019.csv", function (csvData) {

    function isFloat(n){
          return Number(n) === n && n % 1 !== 0;
    }

    //d3.csv("./PCA/datasetConPCA.csv", function (csvData) {
    //d3.csv("./PCA/finaDatasetConIDuePCA.csv", function (csvData) {
    //d3.csv("./PCA/finaDatasetConNumbeo_2PCA.csv", function (csvData) {

    d3.csv("./PCA/finaDatasetConNumbeoFINALE.csv", function (csvData) {
    
    //d3.csv("./PCA/perDebugInterazioni.csv", function (csvData) {

        k = d3.keys(csvData[0]).filter(function(d){return d;});
        //console.log(k);
        for(i in k){
            obs.keys.push(k[i]);
        }
        
        var max_year = undefined;
        var min_year = undefined;
        max_rank = undefined;
        min_rank = undefined;

        max_life_cost = undefined;
        min_life_cost = undefined;
        
        for (i = 0; i < csvData.length; i++) {
            if(i == 0)console.log(csvData[i]);
            year = parseInt(csvData[i].year);
            if(max_year == undefined && min_year == undefined){
                max_year = min_year = year;
            }
            else{
                if(year < min_year) min_year = year;
                if(year > max_year) max_year = year;
            }

            obs.allData.push(csvData[i])
            if(!obs.universities.includes([String(csvData[i].the_institution), String(csvData[i].the_country)])){
                {
                    obs.universities.push([String(csvData[i].the_institution), String(csvData[i].the_country)]);
                    addUniToSelect(String(csvData[i].the_institution));
                }
            }
        }
        //obs.universities.sort();
        setYearRange(min_year, max_year);

        for(i=0; i < obs.allData.length; i++){
            rank = parseInt(obs.allData[i].cwur_world_rank);
            year = parseInt(obs.allData[i].year);
            if(max_rank == undefined && min_rank == undefined && year == max_year){
                max_rank = min_rank = rank;
            }
            else if(year == max_year){
                if(rank < min_rank) min_rank = rank;
                if(rank > max_rank) max_rank = rank;
            }

            life_cost = parseInt(obs.allData[i].indice_affitto_e_vita);
            if(max_life_cost == undefined && min_life_cost == undefined && year == max_year){
                max_life_cost = min_life_cost = life_cost;
            }
            else if(year == max_year){
                if(life_cost < min_life_cost) min_life_cost = life_cost;
                if(life_cost > max_life_cost) max_life_cost = life_cost;
            }


           
        }
        //console.log("min_rank ",min_rank);
        //console.log("max_rank ",max_rank);

        //console.log(" min life cost",min_life_cost);
        //console.log(" max life cost",max_life_cost);

        //console.log("curLifeCost ", curLifeCost);
        //console.log("curRank ", curRank);


        setLifeCostRange(min_life_cost,max_life_cost);
        setRankRange(min_rank, max_rank);
        j = 0;
        for(i=0; i < obs.allData.length; i++){
            rank = parseInt(obs.allData[i].cwur_world_rank);
            if(obs.allData[i].year == max_year && rank <= curRank && life_cost <= curLifeCost){
            	obs.data.push(obs.allData[i]);
                obs.filteredPar.push(obs.allData[i]);
                //j += 1;
                //if(j == 1) console.log(obs.allData[i]);


		    	//console.log(year);
		        //console.log(csvData[i])
		        lat  = obs.allData[i].latitude;
		        long = obs.allData[i].longitude;
		        country = obs.allData[i].the_country;
		        institution = obs.allData[i].the_institution;


		        if(String(lat) == "" && String(long) == ""){
		            //console.log(String(csvData[i].s_institution)); //queste sono tutte università senza latitude e longitude
		            obs.uniNoLatLong.push(obs.allData[i].the_institution);
		            //console.log(csvData[i]["the_institution"])
		        }
		        else{

		            //console.log("##########", lat+" ---- "+long+" ---- "+country+" ---- "+institution);
                    switch (country) {
                        case "United Kingdom" : country = "UK"; break;
                        case "United States" : country = "USA"; break;
                        case "United Arab Emirates" : country = "UAE"; break;
                        case "Saudi Arabia":country ="SAU";break;
                        case "Czech Republic":country = "CECREP";break;
                        case "South Africa": country = "SouthAfrica";break;
                        case "South Korea": country = "Korea";break;
                        case "New Zealand": country = "NewZealand";break;
                    }

		            obs.uniCoordinates.push([parseFloat(long),parseFloat(lat),String(institution), String(country)]);


		            pca_1 = obs.allData[i].PCA_component1;
		        	pca_2 = obs.allData[i].PCA_component2;


		       		obs.coordinatesPCA.push([String(institution),parseFloat(pca_1),parseFloat(pca_2)]);


		        }


            }
          
        }

        //updateMapData();

        //obs.uniRadarChart

        obs.loadingOk = true;
        obs.listeners.dispatchEvent(new Event('dataReady'));
    })

}

DataLoader.prototype.addListener = function (ev, foo) {
    if (this.loadingOk && ev == 'dataReady') foo();
    else this.listeners.addEventListener(ev, foo);
}

DataLoader.prototype.changeYear = function(y){

    //console.log("curLifeCost ",curLifeCost);

    curYear = y;
    max_rank = undefined;
    min_rank = undefined;

    max_life_cost = undefined;
    min_life_cost = undefined;

    this.data.splice(0, this.data.length);
    this.filteredPar.splice(0, this.filteredPar.length);
    this.dotHighlighted.splice(0, this.dotHighlighted.length);
    //
    this.uniCoordinates.splice(0, this.uniCoordinates.length);
    this.coordinatesPCA.splice(0, this.coordinatesPCA.length);
    //
    this.countriesSelected.splice(0,dl.countriesSelected.length);
    //
    this.uniRadarChart.splice(0,this.uniRadarChart.length);
    //
    this.keyLegend.splice(0,this.keyLegend.length);

    //console.log("key legend prima vale : ",this.keyLegend);

    var mia_uni = null;

    for(i in this.allData){
        rank = parseInt(this.allData[i].cwur_world_rank);
        year = parseInt(this.allData[i].year);
        if(max_rank == undefined && min_rank == undefined && year == curYear){
            max_rank = min_rank = rank;
        }
        else if(year == curYear){
            if(rank < min_rank) min_rank = rank;
            if(rank > max_rank) max_rank = rank;
        }

        life_cost = parseInt(obs.allData[i].indice_affitto_e_vita);
        if(max_life_cost == undefined && min_life_cost == undefined && year == curYear){
            max_life_cost = min_life_cost = life_cost;
        }
        else if(year == curYear){
            if(life_cost < min_life_cost) min_life_cost = life_cost;
            if(life_cost > max_life_cost) max_life_cost = life_cost;
        }
    }
    setLifeCostRange(min_life_cost, max_life_cost);
    setRankRange(min_rank, max_rank);

    for(i in this.allData){
        rank = parseInt(this.allData[i].cwur_world_rank);
        life_cost = parseFloat(this.allData[i].indice_costo_della_vita);
        if(parseInt(this.allData[i].year) == y && rank <= curRank && life_cost <= curLifeCost){
            this.data.push(this.allData[i]);
            this.filteredPar.push(this.allData[i]);

            lat  = this.allData[i].latitude;
	        long = this.allData[i].longitude;
	        country = this.allData[i].the_country;
	        institution = this.allData[i].the_institution;


	        if(String(lat) == "" && String(long) == ""){
	            this.uniNoLatLong.push(obs.allData[i].the_institution);
	        }
	        else{

                switch (country) {
                    case "United Kingdom" : country = "UK"; break;
                    case "United States" : country = "USA"; break;
                    case "United Arab Emirates" : country = "UAE"; break;
                    case "Saudi Arabia":country ="SAU";break;
                    case "Czech Republic":country = "CECREP";break;
                    case "South Africa": country = "SouthAfrica";break;
                    case "South Korea": country = "Korea";break;
                    case "New Zealand": country = "NewZealand";break;
                }
	            this.uniCoordinates.push([parseFloat(long),parseFloat(lat),String(institution), String(country)]);
	            

	            pca_1 = this.allData[i].PCA_component1;
		        pca_2 = this.allData[i].PCA_component2;


		        this.coordinatesPCA.push([String(institution),parseFloat(pca_1),parseFloat(pca_2)]);

	        }

	      

   	




        }
    }
        if(dl.student == false){
            console.log("########################################### change year rector");
            this.university  = document.getElementById("uni").value;

            console.log("entrato in changeYear modalità rettore ");
             this.university  = document.getElementById("uni").value;
             console.log("mia university è ",this.university);

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //prelevo il paese

            //console.log("data in initTeacher -> ",this.data);
            //console.log(" this.university -> ", this.university);

            var mia_uni = null;
            //var indice_di_range = null;

            //mi prendo il paese di quella universitàù

            for(i in this.allData){
                    //rank = parseInt(this.allData[i].cwur_world_rank);

                    if(parseInt(this.allData[i].year) == y ){
                        this.data.push(this.allData[i]);
                    }
            }


            console.log("this.data vale ", this.data);
            console.log("this.allData vale ",this.allData);
            for( el in this.data){
                if(this.data[el].the_institution == this.university){
                    
                    this.universityCountry = this.data[el].the_country;
                    this.universityRank = this.data[el].the_rank;
                    mia_uni = this.data[el];

                }
            }


            //mia università

            this.universityDelPaeseDellaMiaScelta.splice(0,this.universityDelPaeseDellaMiaScelta.length);

            //console.log("UTIL.JS this.data",this.data);
            //riempio universityDelPaeseDellaMiaScelta
            //console.log("from utils: ",this.universityDelPaeseDellaMiaScelta);
             for( el in this.data){

                if(this.data[el].the_country == this.universityCountry){
                    this.universityDelPaeseDellaMiaScelta.push(this.data[el]);
                    this.USED_universityDelPaeseDellaMiaScelta.push(this.data[el]);
                }
             }

            this.universityDelPaeseDellaMiaScelta.sort(function(a,b){
                return b.cwur_score - a.cwur_score;
            });

            this.USED_universityDelPaeseDellaMiaScelta.sort(function(a,b){
                return b.cwur_score - a.cwur_score;
            });

             //di questo prendo il range di 10 che caratterizzano l'uni del rettore


             this.indice_di_range = this.universityDelPaeseDellaMiaScelta.indexOf(mia_uni);

             //ar2 = [];
             if(this.indice_di_range <= 5){

                this.universityDelPaeseDellaMiaScelta = this.universityDelPaeseDellaMiaScelta.slice(0, 10);
                this.USED_universityDelPaeseDellaMiaScelta = this.USED_universityDelPaeseDellaMiaScelta.slice(0, 10);

             }
             else{
               this.universityDelPaeseDellaMiaScelta = this.universityDelPaeseDellaMiaScelta.slice(this.indice_di_range-5, this.indice_di_range+5);
                this.USED_universityDelPaeseDellaMiaScelta = this.USED_universityDelPaeseDellaMiaScelta.slice(this.indice_di_range-5, this.indice_di_range+5);
                console.log(this.universityDelPaeseDellaMiaScelta);

             }

            this.coordinatesPCATeacher.splice(0,this.coordinatesPCATeacher.length);


            for( i in this.universityDelPaeseDellaMiaScelta){
                 institution = this.universityDelPaeseDellaMiaScelta[i].the_institution;
                 pca_1 = this.universityDelPaeseDellaMiaScelta[i].PCA_component3;
                 pca_2 = this.universityDelPaeseDellaMiaScelta[i].PCA_component4;
                 //console.log("bellaaaaaaaa ",String(institution),parseFloat(pca_1),parseFloat(pca_2));
                this.coordinatesPCATeacher.push([String(institution),parseFloat(pca_1),parseFloat(pca_2)]);


            }

            console.log(" - this.universityDelPaeseDellaMiaScelta: ",this.universityDelPaeseDellaMiaScelta);

            console.log("########################################### change year rector end");

    	}
    //console.log("key legend dopo vale : ",this.keyLegend);


    obs.listeners.dispatchEvent(new Event('yearChanged'));
}

DataLoader.prototype.changeFilter = function(r){
	if(dl.student){
	    this.data.splice(0, this.data.length);
	    this.filteredPar.splice(0, this.filteredPar.length);
	    this.uniCoordinates.splice(0, this.uniCoordinates.length);
	    this.coordinatesPCA.splice(0, this.coordinatesPCA.length);
	    this.dotHighlighted.splice(0, this.dotHighlighted.length);

	    for(i in this.allData){
	        rank = parseInt(this.allData[i].cwur_world_rank);
            lifeCost = parseFloat(this.allData[i].indice_affitto_e_vita);

	        if(parseInt(this.allData[i].year) == curYear && rank <= parseInt(r) && lifeCost <= curLifeCost){
	            this.data.push(this.allData[i]);
	            this.filteredPar.push(this.allData[i]);

	            lat  = this.allData[i].latitude;
		        long = this.allData[i].longitude;
		        country = this.allData[i].the_country;
		        institution = this.allData[i].the_institution;

		        if(String(lat) == "" && String(long) == ""){
		            this.uniNoLatLong.push(obs.allData[i].the_institution);
		        }
		        else{
	                switch (country) {
	                    case "United Kingdom" : country = "UK"; break;
	                    case "United States" : country = "USA"; break;
	                    case "United Arab Emirates" : country = "UAE"; break;
	                    case "Saudi Arabia":country ="SAU";break;
	                    case "Czech Republic":country = "CECREP";break;
	                    case "South Africa": country = "SouthAfrica";break;
	                    case "South Korea": country = "Korea";break;
	                    case "New Zealand": country = "NewZealand";break;
	                }

		            this.uniCoordinates.push([parseFloat(long),parseFloat(lat),String(institution), String(country)]);
		            
		            pca_1 = this.allData[i].PCA_component1;
			        pca_2 = this.allData[i].PCA_component2;
	                //inizialmente carico tutti i PCAs
			        this.coordinatesPCA.push([String(institution),parseFloat(pca_1),parseFloat(pca_2)]);
		        }     
	        }
	    }

	    //updateMapData();
	    document.getElementById("top").innerHTML = "Top " + r + " [cwur]";

	    //console.log("r vale ",r);

	    obs.listeners.dispatchEvent(new Event('rankChanged'));
	}

	else{

		document.getElementById("top").innerHTML = "Top " + r + " /"+dl.numberOfUniInCountry;
		

			  //console.log("entrato in manageTeacherStuffs");
	     this.university  = document.getElementById("uni").value;

	    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	    //prelevo il paese

	    //console.log("data in initTeacher -> ",dl.data);
	    //console.log(" dl.university -> ", dl.university);

	    var mia_uni = null;

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

	      dl.universityDelPaeseDellaMiaScelta = dl.universityDelPaeseDellaMiaScelta.slice(0, 5);

	    dl.coordinatesPCATeacher.splice(0,dl.coordinatesPCATeacher.length);


	    for( i in dl.universityDelPaeseDellaMiaScelta){
	         institution = dl.universityDelPaeseDellaMiaScelta[i].the_institution;
	         pca_1 = dl.universityDelPaeseDellaMiaScelta[i].PCA_component3;
	         pca_2 = dl.universityDelPaeseDellaMiaScelta[i].PCA_component4;
	         //console.log("bellaaaaaaaa ",String(institution),parseFloat(pca_1),parseFloat(pca_2));
	        dl.coordinatesPCATeacher.push([String(institution),parseFloat(pca_1),parseFloat(pca_2)]);


	    }

	     obs.listeners.dispatchEvent(new Event('rankChanged'));


	}
}


DataLoader.prototype.legendFilter = function(r){
	
		console.log("entrato");


        /*this.coordinatesPCATeacher.splice(0, this.coordinatesPCATeacher.length);

	    for( i in dl.universityDelPaeseDellaMiaScelta){
	         institution = dl.universityDelPaeseDellaMiaScelta[i].the_institution;

             if(this.cliccateInLegenda.includes(institution)){
                 pca_1 = this.universityDelPaeseDellaMiaScelta[i].PCA_component3;
                 pca_2 = this.universityDelPaeseDellaMiaScelta[i].PCA_component4;
                 //console.log("bellaaaaaaaa ",String(institution),parseFloat(pca_1),parseFloat(pca_2));
                this.coordinatesPCATeacher.push([String(institution),parseFloat(pca_1),parseFloat(pca_2)]);

             }
	       
	    }*/
       // console.log("data connected: ",this.uniDataConnected);
	     obs.listeners.dispatchEvent(new Event('legendFilter'));


	
}


DataLoader.prototype.changeFilterLifeCost = function(r,l){
    this.data.splice(0, this.data.length);
    this.filteredPar.splice(0, this.filteredPar.length);
    this.uniCoordinates.splice(0, this.uniCoordinates.length);
    this.coordinatesPCA.splice(0, this.coordinatesPCA.length);
    this.dotHighlighted.splice(0, this.dotHighlighted.length);
    count = 0;
    curLifeCost = l;
    for(i in this.allData){
        rank = parseInt(this.allData[i].cwur_world_rank);
        lifeCost = parseFloat(this.allData[i].indice_affitto_e_vita);
        if(count == 0){
            lifeCost2 = parseFloat(this.allData[i].indice_affitto_e_vita);
            //console.log("indice_affitto_e_vita vale : ",this.allData[i].indice_affitto_e_vita);
            //console.log("lifeCost: ", lifeCost2);
            //console.log("l vale ", l);
        } 
     
        count += 1

        if(parseInt(this.allData[i].year) == curYear && rank <= parseInt(r)   && lifeCost <= parseFloat(l)){
            this.data.push(this.allData[i]);
            this.filteredPar.push(this.allData[i]);

            lat  = this.allData[i].latitude;
            long = this.allData[i].longitude;
            country = this.allData[i].the_country;
            institution = this.allData[i].the_institution;

            if(String(lat) == "" && String(long) == ""){
                this.uniNoLatLong.push(obs.allData[i].the_institution);
            }
            else{
                switch (country) {
                    case "United Kingdom" : country = "UK"; break;
                    case "United States" : country = "USA"; break;
                    case "United Arab Emirates" : country = "UAE"; break;
                    case "Saudi Arabia":country ="SAU";break;
                    case "Czech Republic":country = "CECREP";break;
                    case "South Africa": country = "SouthAfrica";break;
                    case "South Korea": country = "Korea";break;
                    case "New Zealand": country = "NewZealand";break;
                }

                this.uniCoordinates.push([parseFloat(long),parseFloat(lat),String(institution), String(country)]);
                
                pca_1 = this.allData[i].PCA_component1;
                pca_2 = this.allData[i].PCA_component2;
                //inizialmente carico tutti i PCAs
                this.coordinatesPCA.push([String(institution),parseFloat(pca_1),parseFloat(pca_2)]);
            }     
        }
    }

    //updateMapData();
    document.getElementById("top2").innerHTML = "Life Cost: " + l +" [numbeo]" ;

    console.log("l vale ",l);
    console.log("curLifeCost vale", curLifeCost);

    obs.listeners.dispatchEvent(new Event('lifeCostChanged'));
}





DataLoader.prototype.parFilter = function () {
    this.filteredPar.splice(0, this.filteredPar.length);  
    this.uniCoordinates.splice(0, this.uniCoordinates.length);
    this.coordinatesPCA.splice(0, this.coordinatesPCA.length);
    this.dotHighlighted.splice(0, this.dotHighlighted.length);
    for (i = 0; i < this.data.length; i++) {
        if (this.filterPar(this.data[i])){
            
            this.filteredPar.push(this.data[i]);

            lat  = this.data[i].latitude;
	        long = this.data[i].longitude;
	        country = this.data[i].the_country;
	        institution = this.data[i].the_institution;

            //console.log(lat+" "+long+" "+country+" "+institution);

	        if(String(lat) == "" && String(long) == ""){
	            this.uniNoLatLong.push(this.data[i].the_institution);
	        }
	        else{
                switch (country) {
                    case "United Kingdom" : country = "UK"; break;
                    case "United States" : country = "USA"; break;
                    case "United Arab Emirates" : country = "UAE"; break;
                    case "Saudi Arabia":country ="SAU";break;
                    case "Czech Republic":country = "CECREP";break;
                    case "South Africa": country = "SouthAfrica";break;
                    case "South Korea": country = "Korea";break;
                    case "New Zealand": country = "NewZealand";break;
                }
	            this.uniCoordinates.push([parseFloat(long),parseFloat(lat),String(institution), String(country)]);
	           // console.log("-->"+lat+" "+long+" "+country+" "+institution);

	            pca_1 = this.data[i].PCA_component1;
		        pca_2 = this.data[i].PCA_component2;


                this.coordinatesPCA.push([String(institution),parseFloat(pca_1),parseFloat(pca_2)]);

	        }
        }
    }

    obs.listeners.dispatchEvent(new Event('parFilterChanged'));
}

DataLoader.prototype.changeColor = function () {
    this.listeners.dispatchEvent(new Event('changeColor'));
}

DataLoader.prototype.cleanMap = function(){

    this.filteredPar.splice(0, this.filteredPar.length);
    this.coordinatesPCA.splice(0,this.coordinatesPCA.length);
    this.dotHighlighted.splice(0, this.dotHighlighted.length);

    for (i = 0; i < this.data.length; i++) {
        uni = this.data[i].the_institution;
        if (this.uniSelected.length == 0 || this.uniSelected.includes(uni)){

            this.filteredPar.push(this.data[i]);

            

            lat  = this.data[i].latitude;
            long = this.data[i].longitude;
            country = this.data[i].the_country;
            institution = this.data[i].the_institution;

            pca_1 = this.data[i].PCA_component1;
            pca_2 = this.data[i].PCA_component2;

            switch (country) {
                case "United Kingdom" : country = "UK"; break;
                case "United States" : country = "USA"; break;
                case "United Arab Emirates" : country = "UAE"; break;
                case "Saudi Arabia":country ="SAU";break;
                case "Czech Republic":country = "CECREP";break;
                case "South Africa": country = "SouthAfrica";break;
                case "South Korea": country = "Korea";break;
                case "New Zealand": country = "NewZealand";break;
            }

            
            this.coordinatesPCA.push([String(institution),parseFloat(pca_1),parseFloat(pca_2)]);


        } 

    }

    obs.listeners.dispatchEvent(new Event("cleanMap"));
}

DataLoader.prototype.mapFilter = function () {

    this.filteredPar.splice(0, this.filteredPar.length);
    this.coordinatesPCA.splice(0,this.coordinatesPCA.length);
    this.dotHighlighted.splice(0, this.dotHighlighted.length);


    for (i = 0; i < this.data.length; i++) {
        uni = this.data[i].the_institution;
        if (this.uniSelected.length == 0 || this.uniSelected.includes(uni)){

        	this.filteredPar.push(this.data[i]);

        	

        	lat  = this.data[i].latitude;
	        long = this.data[i].longitude;
	        country = this.data[i].the_country;
	        institution = this.data[i].the_institution;

            pca_1 = this.data[i].PCA_component1;
            pca_2 = this.data[i].PCA_component2;

            switch (country) {
                case "United Kingdom" : country = "UK"; break;
                case "United States" : country = "USA"; break;
                case "United Arab Emirates" : country = "UAE"; break;
                case "Saudi Arabia":country ="SAU";break;
                case "Czech Republic":country = "CECREP";break;
                case "South Africa": country = "SouthAfrica";break;
                case "South Korea": country = "Korea";break;
                case "New Zealand": country = "NewZealand";break;
            }

 			
 			this.coordinatesPCA.push([String(institution),parseFloat(pca_1),parseFloat(pca_2)]);


        } 

    }
    obs.listeners.dispatchEvent(new Event('mapFilterChanged'));
}


DataLoader.prototype.scatterFilter = function () {
     obs.listeners.dispatchEvent(new Event('scatterHighlightedChanged'));
}

DataLoader.prototype.initUniData = function () {

    //console.log("initUnitData");
    this.uniData.splice(0, this.uniData.length);
    for(i = 0; i < this.allData.length; i++){
        if(this.university == this.allData[i].the_institution)
            this.uniData.push(this.allData[i]);  
    }

    console.log("uniData vale", this.uniData);
}


DataLoader.prototype.initUniDataConnected = function () {


    //console.log("initUnitDataConnected");
    this.uniDataConnected.splice(0, this.uniDataConnected.length);

    stringhePaesiDellaMiaScelta = [];

    for (i = 0; i < this.universityDelPaeseDellaMiaScelta.length; i++){
        stringhePaesiDellaMiaScelta.push(this.universityDelPaeseDellaMiaScelta[i].the_institution);
    }

    //console.log("stringhe paesi della mia scelta: ",stringhePaesiDellaMiaScelta);
    for(i = 0; i < this.allData.length; i++){
        
        for(j = 0 ;  j < stringhePaesiDellaMiaScelta.length; j++){
            if(this.allData[i].the_institution == stringhePaesiDellaMiaScelta[j]){
               // console.log("entrato");
                this.uniDataConnected.push(this.allData[i]);
            }
        }


    }
    //console.log("uniDataConnected ", this.uniDataConnected);
    //console.log("paesi della mia scelta: ",this.universityDelPaeseDellaMiaScelta);


}


DataLoader.prototype.initDataForRector = function(){


     console.log("--------------------------------------------------- entrato in initDataForRector ");
     this.university  = document.getElementById("uni").value;
     console.log("mia university è ",this.university);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //prelevo il paese

    //console.log("data in initTeacher -> ",this.data);
    //console.log(" this.university -> ", this.university);

    var mia_uni = null;
    //var indice_di_range = null;

    //mi prendo il paese di quella università
    console.log("this.data vale: ",this.data);
    for( el in this.data){
        if(this.data[el].the_institution == this.university){
            
            this.universityCountry = this.data[el].the_country;
            this.universityRank = this.data[el].the_rank;
            mia_uni = this.data[el];

        }
    }


    //mia università

    this.universityDelPaeseDellaMiaScelta.splice(0,this.universityDelPaeseDellaMiaScelta.length);

    //console.log("UTIL.JS this.data",this.data);
    //riempio universityDelPaeseDellaMiaScelta
    //console.log("from utils: ",this.universityDelPaeseDellaMiaScelta);
     for( el in this.data){

        if(this.data[el].the_country == this.universityCountry){
            this.universityDelPaeseDellaMiaScelta.push(this.data[el]);
            this.USED_universityDelPaeseDellaMiaScelta.push(this.data[el]);
        }
     }

    this.universityDelPaeseDellaMiaScelta.sort(function(a,b){
        return b.cwur_score - a.cwur_score;
    });

    this.USED_universityDelPaeseDellaMiaScelta.sort(function(a,b){
        return b.cwur_score - a.cwur_score;
    });

     //di questo prendo il range di 10 che caratterizzano l'uni del rettore


     this.indice_di_range = this.universityDelPaeseDellaMiaScelta.indexOf(mia_uni);

     //ar2 = [];
     if(this.indice_di_range <= 5){

        this.universityDelPaeseDellaMiaScelta = this.universityDelPaeseDellaMiaScelta.slice(0, 10);
        this.USED_universityDelPaeseDellaMiaScelta = this.USED_universityDelPaeseDellaMiaScelta.slice(0, 10);

     }
     else{
       this.universityDelPaeseDellaMiaScelta = this.universityDelPaeseDellaMiaScelta.slice(this.indice_di_range-5, this.indice_di_range+5);
        this.USED_universityDelPaeseDellaMiaScelta = this.USED_universityDelPaeseDellaMiaScelta.slice(this.indice_di_range-5, this.indice_di_range+5);
        console.log(this.universityDelPaeseDellaMiaScelta);

     }

    this.coordinatesPCATeacher.splice(0,this.coordinatesPCATeacher.length);


    for( i in this.universityDelPaeseDellaMiaScelta){
         institution = this.universityDelPaeseDellaMiaScelta[i].the_institution;
         pca_1 = this.universityDelPaeseDellaMiaScelta[i].PCA_component3;
         pca_2 = this.universityDelPaeseDellaMiaScelta[i].PCA_component4;
         //console.log("bellaaaaaaaa ",String(institution),parseFloat(pca_1),parseFloat(pca_2));
        this.coordinatesPCATeacher.push([String(institution),parseFloat(pca_1),parseFloat(pca_2)]);


    }

    console.log(" - this.universityDelPaeseDellaMiaScelta: ",this.universityDelPaeseDellaMiaScelta);

     console.log("--------------------------------------------------- esco da initDataForRector ");
    



}

var dl = new DataLoader();
dl.loadData();
