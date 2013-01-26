
var map = null;
var directionsManager;
var directionsErrorEventObj;
var directionsUpdatedEventObj;
var dtObject = new Object();
dtObject.wayPoint1 = null;
dtObject.wayPoint2 = null;
dtObject.Duration = null;
dtObject.routeColor = null;
dtObject.routeOpacity = null;

function initializeObjects()
{

    //read the dtObjects values from a cookie
    dtObject.wayPoint1 = localStorage.getItem("wayPoint1");
    dtObject.wayPoint2 = localStorage.getItem("wayPoint2");
    dtObject.routeColor = localStorage.getItem("routeColor");
    dtObject.routeOpacity = localStorage.getItem("routeOpacity");

    if (typeof (dtObject.routeOpacity) != null) {
        $("#routeOpacity").slider("value", 55);
    }
    else
        $("#routeOpacity").slider("value", 55);

    var tbWayPoint1 = document.getElementById("wayPoint1");
    var tbWayPoint2 = document.getElementById("wayPoint2");
    var tbRouteColor = document.getElementById("routeColor");
    var tbRouteOpacity = document.getElementById("routeOpacity");

    if (typeof(dtObject.wayPoint1)=="undefined")
        tbWayPoint1.innerText = dtObject.wayPoint1;

    if (typeof(dtObject.wayPoint2)=="undefined")
        tbWayPoint2.innerText = dtObject.wayPoint2;

    if (typeof(dtObject.routeColor)=="undefined")
        tbRouteColor.value = dtObject.routeColor;

    if (typeof(dtObject.routeOpacity)=="undefined")
        tbRouteOpacity.innerText = dtObject.routeOpacity;

    if (typeof(dtObject.wayPoint1) == undefined)
    {
        dtObject.wayPoint1 = "2668 Town Lake Dr, Woodbury, MN, 55125";
    }
}

function saveSettings() {

    

    var tbWayPoint1 = document.getElementById("wayPoint1");
    var tbWayPoint2 = document.getElementById("wayPoint2");
    var tbRouteColor = document.getElementById("routeColor");
    var tbRouteOpacity = document.getElementById("routeOpacity");

    var txtWP1 = tbWayPoint1.value;
    var txtWP2 = tbWayPoint2.value;
    var txtRC = tbRouteColor.value;
    var txtRO = tbRouteOpacity.value;

    localStorage.setItem("wayPoint1", txtWP1);
    localStorage.setItem("wayPoint2", txtWP2);
    localStorage.setItem("routeColor", txtRC);
    localStorage.setItem("routeOpacity", txtRO);

    //read the dtObjects values from a cookie
    dtObject.wayPoint1 = localStorage.getItem("wayPoint1");
    dtObject.wayPoint2 = localStorage.getItem("wayPoint2");
    dtObject.routeColor = localStorage.getItem("routeColor");
    dtObject.routeOpacity = localStorage.getItem("routeOpacity");

}

function createMap() {

    initializeObjects();
    // Initialize the map
    map = new Microsoft.Maps.Map(document.getElementById("myMap"),
                 { credentials: "Aq046iezWfpJSRPoDpS4LI8oEDuUtFYpUX_UnNq0tdnMUy77SQuvF-6TdeSLSyax" });

    var latVal = 44.93829887705892;
    var longVal = -93.0003124149414;


    // Set the map center
    map.setView({ center: new Microsoft.Maps.Location(latVal, longVal) });

    var options = map.getOptions();
    options.zoom = 12;
    map.setView(options);

    Microsoft.Maps.loadModule('Microsoft.Maps.Traffic', {
        callback: function () {
            trafficLayer = new Microsoft.Maps.Traffic.TrafficLayer(map);
            var tileLayer = trafficLayer.getTileLayer();
            tileLayer.setOptions({ opacity: 1.0 });

            // show the traffic Layer 
            trafficLayer.show();
        }
    });

    if (!directionsManager) {
        Microsoft.Maps.loadModule('Microsoft.Maps.Directions', { callback: createDrivingRoute });
    }
    else {
        createDrivingRoute(0);
    }
    var currentTime = new Date();
    var hours = currentTime.getHours() % 12;
    if (hours == 0) {
        hours = 12;
    }
    var UpdateTimeDisplay = document.getElementById("updateTime");
    var minutes = currentTime.getMinutes();
    if (minutes < 10) {
        UpdateTimeDisplay.innerHTML = "Last Updated: " + hours + ":0" + minutes;
    }
    else {
        UpdateTimeDisplay.innerHTML = "Last Updated: " + hours + ":" + minutes;
    }
}




function home() {
    var query = document.getElementById("LocA").value;


    map.getCredentials(function (credentials) {
        var searchRequest = 'http://dev.virtualearth.net/REST/v1/Locations/' + query + '?output=json&jsonp=SearchServiceCallback&key=AmLVAXMn2L1eVoiJ-v4jC9Sxyoh1A-DAViCGgQZT7xsGjZGJJMEo2p1sEIy2G_95';
        var mapscript = document.createElement('script');
        mapscript.type = 'text/javascript';
        mapscript.src = searchRequest;
        document.getElementById('myMap').appendChild(mapscript);
    });
    var latlon = map.getCenter();
    document.getElementById('Latitude').value = latlon.latitude;  // + '/' + latlon.longitude
    document.getElementById('Longitude').value = latlon.longitude;
    document.getElementById('LatLong').value = latlon.latitude + ',' + latlon.longitude
}

function mapData() {

    var latlon = map.getCenter();
    document.getElementById('Latitude').value = latlon.latitude;  // + '/' + latlon.longitude
    document.getElementById('Longitude').value = latlon.longitude;
    var options = map.getOptions();
    document.getElementById('LatLong').value = options.zoom;
}

function SearchServiceCallback(result) {
    var output = document.getElementById("output");
    if (output) {
        while (output.hasChildNodes()) {
            output.removeChild(output.lastChild);
        }
    }

    var resultsHeader = document.createElement("h5");

    output.appendChild(resultsHeader);

    if (result && result.resourceSets && result.resourceSets.length > 0 && result.resourceSets[0].resources &&
    result.resourceSets[0].resources.length > 0) {
        resultsHeader.innerHTML = "Bing Maps REST Search API  <br/>  Found location " + result.resourceSets[0].resources[0].name;

        var bbox = result.resourceSets[0].resources[0].bbox;

        var viewBoundaries = Microsoft.Maps.LocationRect.fromLocations(new Microsoft.Maps.Location(bbox[0], bbox[1]), new Microsoft.Maps.Location(bbox[2], bbox[3]));

        map.setView({ bounds: viewBoundaries });

        var location = new Microsoft.Maps.Location(result.resourceSets[0].resources[0].point.coordinates[0], result.resourceSets[0].resources[0].point.coordinates[1]);
        var pushpin = new Microsoft.Maps.Pushpin(location, { text: "erik" });

        map.entities.push(pushpin);


    }
    else {
        if (typeof (response) == 'undefined' || response == null) {
            alert("Invalid credentials or no response");
        }
        else {
            if (typeof (response) != 'undefined' && response && result && result.errorDetails) {
                resultsHeader.innerHTML = "Message :" + response.errorDetails[0];
            }

            alert("No results for the query");
        }
    }
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}
