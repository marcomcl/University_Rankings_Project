Colors = function () {
	var darkMode = localStorage.getItem("darkMode");
	if (darkMode == undefined) this.darkMode = false;
    else if (darkMode == 'true') this.darkMode = true;
    else this.darkMode = false;
}

Colors.prototype.isDarkModeEnabled = function () {
    return this._darkMode;
}

Colors.prototype.setDarkMode = function (enabled) {
    localStorage.setItem('darkMode', enabled.toString());
    this._darkMode = enabled;
}

Colors.prototype.parallelHighlight = function () {
	//return '#ff0000';
     // return '#99d8c9'; //prima #ff0000
    return '#3397de';
}

Colors.prototype.parallelNormal = function () {
	//return '#31a354';
    return "#2ca25f"; //prima #31a354
}

Colors.prototype.parallelBG = function () {
    return '#ddd';
}

Colors.prototype.colorScatter = function(){
    return '#f03b20'
}

Colors.prototype.barChart = function () {
    return '#2ca25f'; //prima #8856a7
}

Colors.prototype.barChartUni = function () {
    return '#a6bddb';
}

Colors.prototype.getColorCountry = function () {
    return "#9ebcda"; 
}

Colors.prototype.getBgMap = function () {
    if (this.isDarkModeEnabled()) return "#a8a8a8";
    else return "#ffffff";
}

Colors.prototype.getMapOver = function () {
    if (this.isDarkModeEnabled()) return "#ebe6e6";
    else return "#636363"; //prima: #a8a8a8
}

Colors.prototype.getColorMarginCountry = function () {
    if (this.isDarkModeEnabled()) return "#525050";
    else return "#4f4f4f";
}

Colors.prototype.getColorUniversity = function () {
	return '#2ca25f'; 
    //return '#99d8c9'; //prima #f03b20
}

Colors.prototype.getColorUniversityScatter = function () {
    return '#3397de';
}

Colors.prototype.getColorSelectedUniversity = function () {
    return '#252850'; //blu scuro
}

Colors.prototype.getStartColorCountry= function () {
    return '#ffffff'; //blu scuro
}



Colors.prototype.getBackgroundColor = function () {
    if (this.isDarkModeEnabled()) return "#193e51";
    //else return "#ffffff";
    else return "#ebebe4";
}

Colors.prototype.getHeaderBackgroundColor = function () {
    if (this.isDarkModeEnabled()) return "#506a70";
   // else return "#f0f0f0";
   else return "#e3e3e3";
}

Colors.prototype.getTextColor = function () {
    if (this.isDarkModeEnabled()) return "#ffffff";
    else return "#000000";
}

Colors.prototype.getAxisColor = function () {
    if (this.isDarkModeEnabled()) return "#ffffff";
    else return "#000000";
}

var colors = new Colors();
darkModeBtn();

function darkModeBtn() {
    var darkmode_icon = document.getElementById('darkmode_icon');
    var student_icon = document.getElementById('student_icon');
    if (colors.isDarkModeEnabled()) darkmode_icon.src = './res/daymode.svg';
    else darkmode_icon.src = './res/darkmode.svg';
    document.getElementById('darkmode_btn').addEventListener("click", function () {
        colors.setDarkMode(!colors.isDarkModeEnabled());
        if (colors.isDarkModeEnabled()) {
            darkmode_icon.src = './res/daymode.svg';
            student_icon.src = './res/student_dark.svg';
        }
        else {
            darkmode_icon.src = './res/darkmode.svg';
            student_icon.src = './res/student.svg';
        }
        dl.changeColor();
    });
}