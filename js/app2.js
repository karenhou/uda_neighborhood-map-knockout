// models
var init_locations = [{
        title: 'messe frankfurt',
        latLng: { lat: 50.1102447, lng: 8.6483381 }
    },
    {
        title: 'Städel Museum',
        latLng: { lat: 50.1030925, lng: 8.6740583 }
    },
    {
        title: 'Römerberg',
        latLng: { lat: 50.1107073, lng: 8.6819623 }
    },
    {
        title: 'Kleinmarkthalle',
        latLng: { lat: 50.1128541, lng: 8.6836329 }
    },
    {
        title: 'Kaiserdom St. Bartholomäus',
        latLng: { lat: 50.1106631, lng: 8.6854204 }
    },
    {
        title: 'Gerechtigkeitsbrunnen',
        latLng: { lat: 50.1104364, lng: 8.682155 }
    },
    {
        title: 'The Hauptwache',
        latLng: { lat: 50.1134865, lng: 8.6787432 }
    },
    {
        title: 'MyZeil',
        latLng: { lat: 50.1143519, lng: 8.6814498 }
    }
];

var Locations = function(data) {
    this.title = ko.observable(data.title);
    this.latLng = ko.observable(data.latLng);
    this.marker = null;
};

var infowindow = new google.maps.InfoWindow();

var markers = [];

var content = '';

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

    var flickrApiKey = "8a50fd348c22d2b59d1ef5aba1c6e272";

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
                content = '<p><img id="pixBox" src="' + pixLink + '"/></a></p>';
            } else {
                content = 'flickr api error occured! Message: ' + response.message;
            }

        },
        error: function(response) {
            content = 'flickr api error occured';
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
var koViewModel = function(map) {

    var self = this;

    self.googleMap = map;

    this.locationList = ko.observableArray([]);

    init_locations.forEach(function(place) {
        self.locationList.push(new Locations(place));
    });

    for (var i = 0; i < self.locationList().length; i++) {

        var position = self.locationList()[i].latLng();
        var title = self.locationList()[i].title();

        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            map: self.googleMap,
        });
        getFlickrPix(marker);

        markers.push(marker);

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
            if (markers[i].title === self.currentPlace().title()) {
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

        for (var i = 0; i < init_locations.length; i++) {
            if (init_locations[i].title.toLowerCase().indexOf(searchInput) !== -1) {
                self.locationList.push(new Locations(init_locations[i]));
                markers[i].setVisible(true);
            } else {
                markers[i].setVisible(false);
            }
        }
    };
};

var frankfurt_latLng = { lat: 50.110924, lng: 8.682127 };

var googleMap;

// create google map
function createMap() {
    return new google.maps.Map(document.getElementById('map'), {
        center: frankfurt_latLng,
        zoom: 14
    });
}

google.maps.event.addDomListener(window, 'load', function() {
    googleMap = createMap();
    ko.applyBindings(new koViewModel(googleMap));

});

google.maps.event.addDomListener(window, "resize", function() {
    var center = googleMap.getCenter();
    google.maps.event.trigger(googleMap, "resize");
    googleMap.setCenter(center);
});