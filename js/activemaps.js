/**
 * Created by ffoti on 12/14/13.
 */
// animation for time
var loopcnt = 0;
function play() {
    if(loopcnt > 0) return;
    loopcnt = 19;
    $("#slider").slider('value',25-loopcnt);
    redraw(25-loopcnt);
    loopcnt--;
    (function myLoop () {
        setTimeout(function () {
            if (loopcnt <= 0) return;
            $("#slider").slider('value',25-loopcnt);
            redraw(25-loopcnt);
            --loopcnt;
            myLoop();
        }, 2000)
    })();
}
function stop() {
    loopcnt = 0;
}

// create the legend and jquery interface objects
$(function() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-44927674-1', 'synthicity.com');
    ga('send', 'pageview');
    $(".inline").colorbox({inline:true, width:"50%", opacity: .6});

    var labels = [];
    for (var i = 0; i < modes.length; i++) {
        labels.push('<i style="background:' + modecolor(i+1) + '"></i>' +modes[i]);
    }
    var legend = labels.join('<br>')+"<br>Size=Age";
    $("#legend").html(legend);

    $( "#slider" ).slider({
        min: 1,
        max: 24,
        step: 1,
        slide: function( event, ui ) { redraw(ui.value); }
    });

    $("#regionchooser").change(function(s) {
        region = $("#regionchooser").find(":selected").val();
        map.panTo(centerd[region]);
        map.setZoom(basezoom);
        setbounds(region);
        readcsv(region,income);
    });
    $("#incomechooser").change(function(s) {
        income = $("#incomechooser").find(":selected").val();
        readcsv(region,income);
    });
});

// pick the manually specified region or manually specified diary
segment = null;
if(document.URL.indexOf('?') == -1) var region = "newyork"; // default to new york since the data is available in default distribution
else {
    var region = document.URL.match(/region=([^&]+)/)[1];
    $('#regionchooser option[value='+region+']').attr('selected', 'selected');;
    var segment = document.URL.match(/segment=([^&]+)/);
    if(segment) {
        segment = segment[1];
    }
}
if($.inArray(region,REGIONLIST)==-1)
    alert("Region must be one of " + REGIONLIST.join(", "));
var centerd = REGIONCENTERS;
var center = centerd[region];

var map = new L.Map("map", {center: center, zoom: basezoom});
var layer = new L.StamenTileLayer("toner-lite");
map.addLayer(layer);

function project(x) {
    var point = map.project(new L.LatLng(x[1], x[0]),basezoom);
    return [point.x, point.y];
}

var scale = 1.0;
var svg = d3.select(map.getPanes().overlayPane).append("svg")
var g = svg.append("g").attr("class", "leaflet-zoom-hide");

var data = {};
var income = defincome;

var bounds, projbounds;

function setbounds(region) {
    if(region in boundsd) bounds = boundsd[region];
    else bounds = defbounds;
    projbounds = [project(bounds[0]),project(bounds[1])]
}
setbounds(region);

map.on("viewreset", rezoom);
map.on("moveend", rechart);

function mostrecent(d,hour) {
    for(;hour>0;hour--) {
        if(hour in d) return d[hour];
    }
    return d['first'];
}

var modechart = nv.models.pieChart()
    .x(function(d) { return d.label })
    .y(function(d) { return d.value })
    .color(function(d) { return modecolor(d.index+1) || modecolor(d.data.index+1);})
    .labelThreshold(.1)
    .showLabels(false);

var agechart = nv.models.discreteBarChart()
    .x(function(d) { return d.label })
    .y(function(d) { return d.value })
    .staggerLabels(true)
    .transitionDuration(1000);

function readcsv(region,income) {
    g.selectAll("circle").data([]).exit().remove(); // remove old circles
    data = {};

    var fname = get_file_name(region,income,segment);

    d3.csv(fname, function(d) {
        return {
            hhid:  +d.HHID,
            perid: +d.PERID,
            mode:  +d.MODE,
            age:   +d.AGE,
            hour:  +d.ARR_HR,
            lon:   +d.XCORD,
            lat:   +d.YCORD,
            plon:  project([+d.XCORD,+d.YCORD])[0]-projbounds[0][0],
            plat:  project([+d.XCORD,+d.YCORD])[1]-projbounds[0][1],
        };
    }, function(error, rows) {

        rows.forEach(function(r) {
            var key = [r.hhid,r.perid];
            if(!(key in data)) {
                r.mode = 6;
                data[key] = {'key': key, 'first': r};
            }
            data[key][r.hour] = r;
        });
        data = Object.keys(data).map(function(key){return data[key];});
        rezoom();
        hour = $("#slider").slider('value');

        d3.select("#modechart svg")
            .datum(modecount(hour))
            .transition().duration(1000)
            .call(modechart);

        d3.select("#agechart svg")
            .datum(agecount(hour))
            .transition().duration(1000)
            .call(agechart);

        nv.addGraph(function () {return modechart;});
        nv.addGraph(function () {return agechart;});

        g.selectAll("circle")
            .data(data,keyf)
            .enter()
            .append("circle")
            .attr("r", function(d) { return d['first'].age/15/Math.sqrt(scale); })
            .style("fill", function(d) { return modecolor(mostrecent(d,hour).mode); })
            .attr("cx", function(d) { return mostrecent(d,hour).plon; })
            .attr("cy", function(d) { return mostrecent(d,hour).plat; });
    });
}
readcsv(region,income);

function keyf(d) { return d['key']; }

function agecount(hour) {
    var spec = {};
    var b = map.getBounds();
    var maxages = [15,30,45,60,75,90];
    for(i=0;i<maxages.length;i++) spec[i] = {"index": i, "label": maxages[i], "value": 0};
    spec[2]["value"] += 1;
    data.forEach(function(d) {
        var d = mostrecent(d,hour);
        if(d.lat<=b._southWest.lat || d.lat>=b._northEast.lat) return;
        if(d.lon<=b._southWest.lng || d.lon>=b._northEast.lng) return;
        for(j=0;j<maxages.length-1;j++) {
            if(d.age < maxages[j]) break;
        }
        spec[j]["value"] += 1;
    });

    spec = Object.keys(spec).map(function(key){return spec[key];});
    spec = [{key: "Agedist", values: spec}];
    return spec;
}

function modecount(hour) {
    var spec = {};
    var b = map.getBounds();
    for(i=0;i<modes.length;i++) spec[i+1] = {"index": i, "label": modes[i], "value": 0};
    spec[6]["value"] += 1;
    data.forEach(function(d) {
        var d = mostrecent(d,hour);
        if(d.lat<=b._southWest.lat || d.lat>=b._northEast.lat) return;
        if(d.lon<=b._southWest.lng || d.lon>=b._northEast.lng) return;
        spec[d.mode]["value"] += 1;
    });

    spec = Object.keys(spec).map(function(key){return spec[key];});
    return spec;
}

function rezoom() {
    var topLeft = project(bounds[0]),
        bottomRight = project(bounds[1]);
    var width = bottomRight[0] - topLeft[0],
        height = bottomRight[1] - topLeft[1];
    var point = map.latLngToLayerPoint(new L.LatLng(bounds[0][1], bounds[0][0]));

    scale = Math.pow(2,map.getZoom() - basezoom);
    svg.attr("width", width*scale)
        .attr("height", height*scale)
        .style("margin-left", point.x + "px")
        .style("margin-top", point.y + "px");

    var s = "translate(" + -point.x + "," + -point.y + ")";
    g.attr("transform",s);
    g.attr("transform", "scale("+scale+")");
    g.selectAll("circle")
        .data(data)
        .attr("r", function(d) { return d['first'].age/15/Math.sqrt(scale); });
}

function rechart() {
    hour = $("#slider").slider('value');
    d3.select("#modechart svg")
        .datum(modecount(hour))
        .transition().duration(1000)
        .call(modechart);
    d3.select("#agechart svg")
        .datum(agecount(hour))
        .transition().duration(1000)
        .call(agechart);
}

function redraw(hour) {
    d3.select("#metainfo").text((hour<10?"0":"")+hour+":00");
    g.selectAll("circle")
        .data(data)
        .attr("r", function(d) { return d['first'].age/15/Math.sqrt(scale); })
        .style("fill", function(d) { return modecolor(mostrecent(d,hour).mode); })
        .transition().duration(2000)
        .attr("cx", function(d) { return mostrecent(d,hour).plon; })
        .attr("cy", function(d) { return mostrecent(d,hour).plat; });
    d3.select("#modechart svg")
        .datum(modecount(hour))
        .transition().duration(1000)
        .call(modechart);
    d3.select("#agechart svg")
        .datum(agecount(hour))
        .transition().duration(1000)
        .call(agechart);
}