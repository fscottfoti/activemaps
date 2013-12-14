/**
 * Created by ffoti on 12/14/13.
 */

// lost of available regions
var REGIONLIST = ["sandiego", "newyork", "mexicocity", "bayarea", "monterey", "sacramento", "bakersfield", "losangeles", "fresno"];
// center in lat/long of each region
var REGIONCENTERS = {"sandiego": [32.73, -117.07], "monterey": [36.78, -121.85], "sacramento": [38.57, -121.5], "bakersfield": [35.33, -119.05], "fresno": [36.77, -119.72], "bayarea": [37.7792, -122.3391], "losangeles": [34.05, -118.24], "newyork": [40.78, -73.97], "mexicocity": [19.432, -99.133]};

// default zoom level
var basezoom = 12;
var defincome = 7;

// list of mode names and mapping of modeids to colors
var modes = ["Transit", "Bike", "Walk", "Other", "Car", "Home", "Collectivo", "Collectivo+Transit", "Taxi"];
var modecolor = function (d) {
    if (d == 3) return "red";      // walk
    if (d == 2) return "orange";  // bike
    if (d == 1) return "yellow"; // transit
    if (d == 4) return "green"; // other
    if (d == 5) return "blue"; // car
    if (d == 6) return "brown"; // home
    if (d == 7) return "#AF7817";
    if (d == 8) return "#EAC117";
    if (d == 9) return "pink";
}

// default bounds, these are the bounds of california
var defbounds = [[-124.475,42.223],[-114.604,32.04]];
// override bounds for other regions
var boundsd = {"newyork": [[-75.2,42.05],[-72.0,39.57]],"mexicocity":[[-99.517,19.792],[-98.66,19.079]]}

var get_file_name = function (region, income, segment) {
    var fname;
    if (region == "newyork") fname = region + "/minibats" + income + ".csv";
    else fname = "batsdata/" + region + "/minibats" + income + ".csv";

    if (segment != null) {
        if (region == "newyork") fname = region + "/" + segment + ".csv";
        else fname = "batsdata/" + region + "/" + segment + ".csv";
        segment = null;
    }
    return fname;
}