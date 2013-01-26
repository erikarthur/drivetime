function createDirectionsManager() {
    var displayMessage;
    if (!directionsManager) {
        directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
        displayMessage = 'Directions Module loaded\n';
        displayMessage += 'Directions Manager loaded';
    }
    //alert(displayMessage);
    directionsManager.resetDirections();
    directionsErrorEventObj = Microsoft.Maps.Events.addHandler(directionsManager, 'directionsError', function (arg) { });
    directionsUpdatedEventObj = Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function () { });
}

function createDrivingRoute(iDirection) {
    if (!directionsManager) { createDirectionsManager(); }
    directionsManager.resetDirections();
    // Set Route Mode to driving 
    var options = directionsManager.getRenderOptions();
    options.drivingPolylineOptions.visible = false;
    //ff0088
    options.drivingPolylineOptions.strokeColor.a = 255;
    options.drivingPolylineOptions.strokeColor.r = 255;
    options.drivingPolylineOptions.strokeColor.g = 0;
    options.drivingPolylineOptions.strokeColor.b = 136;
    directionsManager.setRenderOptions(options);
    options = directionsManager.getRenderOptions();
    
    directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.driving, displayRouteSelector:false });

    WoodburyWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: dtObject.wayPoint1 });
    StPaulWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: dtObject.wayPoint2 });


    if (typeof(WoodburyWayPoint) == undefined)
        WoodburyWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: '2668 Town Lake Dr Woodbury MN 55125' });

    if (typeof (StPaulWaypoint) == undefined) 
        StPaulWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: '30 e 7th St St Paul MN' });

    if (iDirection === 0) {
        directionsManager.addWaypoint(WoodburyWaypoint);
        directionsManager.addWaypoint(StPaulWaypoint);
    }
    else {
        directionsManager.addWaypoint(StPaulWaypoint);
        directionsManager.addWaypoint(WoodburyWaypoint);
    }
    // Set the element in which the itinerary will be rendered
    directionsManager.setRenderOptions({ itineraryContainer: document.getElementById('output') });
    Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', parseOutput);
    directionsManager.calculateDirections();
    
}