var Locations = function(data) {
    this.title = data.title;
    this.latLng = data.latLng;
    this.marker = null;
};

var infowindow;

var markers = [];

var content = '';

var frankfurt_latLng = { lat: 50.110924, lng: 8.682127 };

var googleMap;

// generate google map api info window content which is exrtracted from Flickr
function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>Flickr pix for: ' + marker.title + ' ' + content + '</div>');
        infowindow.open(map, marker);
        infowindow.addListener('closeclick', function() {
            infowindow.setMarker(null);
        });
    }
    toggleMarker(marker);
}

// get picture links from Flickr
function getFlickrPix(marker) {

    var flickrApiKey = "b24a1bb2f8e0ffd430f255352fc504b8";

    var flickrUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + flickrApiKey +
        "&text=" + marker.title.replace(/ /g, "+") + "&lat=" + marker.getPosition().lat() + "&lon=" + marker.getPosition().lng() +
        "&radius=3&radius_units=km&per_page=50&page=1&format=json&jsoncallback=?";
    $.ajax({
        url: flickrUrl,
        dataType: "jsonp",
        success: function(response) {
            if (response.stat == 'ok') {
                var x = Math.floor(Math.random() * (49 - 0 + 1)) + 0;
                var flickrInfo = response.photos.photo[x];
                var pixLink = "https://farm" + flickrInfo.farm + ".staticflickr.com/" + flickrInfo.server +
                    "/" + flickrInfo.id + "_" + flickrInfo.secret + "_m.jpg";
                content = '<p><img id="pix-box" src="' + pixLink + '"/></a></p>';
            } else {
                content = 'flickr api error occured! Message: ' + response.message;
            }

        },
        error: function(response) {
            content = 'flickr api error occured';
            alert('flickr api error occured');
        }
    });
}

// set animation on Markers. Whenever it is clicked on the map or selected on the list, it bounces on the google map
function toggleMarker(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
    }, 1200);
}

// view model
var KoViewModel = function(map) {

    var self = this;

    self.googleMap = map;

    this.locationList = ko.observableArray([]);

    initLocations.forEach(function(place) {
        self.locationList.push(new Locations(place));
    });

    for (var i = 0; i < self.locationList().length; i++) {

        var position = self.locationList()[i].latLng;
        var title = self.locationList()[i].title;

        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            map: self.googleMap,
        });
        getFlickrPix(marker);

        markers.push(marker);

        /*jshint loopfunc: true */
        map.addListener('center_changed', function() {
            // 3 seconds after the center of the map has changed, pan back to the
            // marker.
            window.setTimeout(function() {
                map.panTo(marker.getPosition());
            }, 3000);
        });

        /*jshint loopfunc: true */
        marker.addListener('click', function() {
            getFlickrPix(this);
            populateInfoWindow(this, infowindow);
        });

        markers[i].setMap(self.googleMap);
    }

    this.currentPlace = ko.observable(this.locationList()[0]);

    this.setPlace = function(clickedPlace) {

        self.currentPlace(clickedPlace);

        for (var i = 0; i < markers.length; i++) {
            if (markers[i].title === self.currentPlace().title) {
                getFlickrPix(markers[i]);
                toggleMarker(markers[i]);
                populateInfoWindow(markers[i], infowindow);
            }
        }
    };

    self.userInput = ko.observable('');

    self.filterMarkers = function() {
        if (infowindow) {
            infowindow.close();
        }
        var searchInput = self.userInput().toLowerCase();

        self.locationList.removeAll();

        for (var i = 0; i < initLocations.length; i++) {
            if (initLocations[i].title.toLowerCase().indexOf(searchInput) !== -1) {
                self.locationList.push(new Locations(initLocations[i]));
                markers[i].setVisible(true);
            } else {
                markers[i].setVisible(false);
            }
        }
    };
};

function googleMapError() {
    alert('Unable to load Google Map');
}

// create google map
function createMap() {
    return new google.maps.Map(document.getElementById('map'), {
        center: frankfurt_latLng,
        zoom: 14
    });
}

function resetMapCenter() {
    google.maps.event.addDomListener(window, "resize", function() {
        var center = googleMap.getCenter();
        google.maps.event.trigger(googleMap, "resize");
        googleMap.setCenter(center);
    });
}

function initMap() {
    infowindow = new google.maps.InfoWindow();
    googleMap = createMap();
    ko.applyBindings(new KoViewModel(googleMap));
    resetMapCenter();
}