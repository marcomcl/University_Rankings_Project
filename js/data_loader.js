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
    d3.csv("./PCA/finaDatasetConIDuePCA.csv", function (csvData) {

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
        
        for (i = 0; i < csvData.length; i++) {
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
           
        }

        setRankRange(min_rank, max_rank);
        j = 0;
        for(i=0; i < obs.allData.length; i++){
            rank = parseInt(obs.allData[i].cwur_world_rank);
            if(obs.allData[i].year == max_year && rank <= curRank){
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

    curYear = y;
    max_rank = undefined;
    min_rank = undefined;
    this.data.splice(0, this.data.length);
    this.filteredPar.splice(0, this.filteredPar.length);
    //
    this.uniCoordinates.splice(0, this.uniCoordinates.length);
    this.coordinatesPCA.splice(0, this.coordinatesPCA.length);
    //
    this.countriesSelected.splice(0,dl.countriesSelected.length);
    //
    this.uniRadarChart.splice(0,this.uniRadarChart.length);
    //
    this.keyLegend.splice(0,this.keyLegend.length);

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
    }

    setRankRange(min_rank, max_rank);

    for(i in this.allData){
        rank = parseInt(this.allData[i].cwur_world_rank);
        if(parseInt(this.allData[i].year) == y && rank <= curRank){
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
        	console.log("entro perchè dl.student è false");
	        for(i in this.allData){
		        if(parseInt(this.allData[i].year) == y ){
		            this.data.push(this.allData[i]);
		            this.filteredPar.push(this.allData[i]);

		            lat  = this.allData[i].latitude;
			        long = this.allData[i].longitude;
			        country = this.allData[i].the_country;
			        institution = this.allData[i].the_institution;


		        //parte per aggiornare dati del prof     

			        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			        if(String(institution) == dl.university){
			        	
			            dl.universityRank = this.allData[i].the_rank;
			            mia_uni = this.allData[i];
			          
			   		    this.universityDelPaeseDellaMiaScelta.splice(0,this.universityDelPaeseDellaMiaScelta.length);

			   		        //riempio universityDelPaeseDellaMiaScelta
					     for( el in this.filteredPar){
					        if(this.filteredPar[el].the_country == dl.universityCountry){
					            dl.universityDelPaeseDellaMiaScelta.push(this.filteredPar[el]);
					        }
					     }

					     this.indice_di_range = this.universityDelPaeseDellaMiaScelta.indexOf(mia_uni);
			    		
					     if(this.indice_di_range < 10){

					        this.universityDelPaeseDellaMiaScelta = this.universityDelPaeseDellaMiaScelta.slice(0, 10);

					     }
					     else if(this.indice_di_range >= 10){

					       this.universityDelPaeseDellaMiaScelta = this.universityDelPaeseDellaMiaScelta.slice(indice_di_range-10, indice_di_range);

					     }

		    			this.coordinatesPCATeacher.splice(0,this.coordinatesPCATeacher.length);


					    for( i in this.universityDelPaeseDellaMiaScelta){
					         institution = this.universityDelPaeseDellaMiaScelta[i].the_institution;
					         pca_1 = this.universityDelPaeseDellaMiaScelta[i].PCA_component3;
					         pca_2 = this.universityDelPaeseDellaMiaScelta[i].PCA_component4;
					        this.coordinatesPCATeacher.push([String(institution),parseFloat(pca_1),parseFloat(pca_2)]);


					    }

		      		 }

	       	 	}
	   		 }


    	}

    obs.listeners.dispatchEvent(new Event('yearChanged'));
}

DataLoader.prototype.changeFilter = function(r){
    this.data.splice(0, this.data.length);
    this.filteredPar.splice(0, this.filteredPar.length);
    this.uniCoordinates.splice(0, this.uniCoordinates.length);
    this.coordinatesPCA.splice(0, this.coordinatesPCA.length);

    for(i in this.allData){
        rank = parseInt(this.allData[i].cwur_world_rank);
        if(parseInt(this.allData[i].year) == curYear && rank <= parseInt(r)){
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

    obs.listeners.dispatchEvent(new Event('rankChanged'));
}



DataLoader.prototype.parFilter = function () {
    this.filteredPar.splice(0, this.filteredPar.length);  
    this.uniCoordinates.splice(0, this.uniCoordinates.length);
    this.coordinatesPCA.splice(0, this.coordinatesPCA.length);
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
    this.uniData.splice(0, this.uniData.length);
    for(i = 0; i < this.allData.length; i++){
        if(this.university == this.allData[i].the_institution)
            this.uniData.push(this.allData[i]);  
    }
}

var dl = new DataLoader();
dl.loadData();
