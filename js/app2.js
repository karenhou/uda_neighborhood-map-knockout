// models
var init_locations = [{
        title: 'my airbnb',
        latLng: { lat: 50.10504, lng: 8.64451 }
    },
    {
        title: 'messe frankfurt',
        latLng: { lat: 50.1102447, lng: 8.6483381 }
    },
    {
        title: 'Städel Museum',
        latLng: { lat: 50.1030925, lng: 8.6740583 }
    },
    {
        title: 'Römerberg 羅馬廣場',
        latLng: { lat: 50.1107073, lng: 8.6819623 }
    },
    {
        title: 'Kleinmarkthalle 小市場',
        latLng: { lat: 50.1128541, lng: 8.6836329 }
    },
    {
        title: 'Kaiserdom St. Bartholomäus 教堂',
        latLng: { lat: 50.1106631, lng: 8.6854204 }
    },
    {
        title: 'Gerechtigkeitsbrunnen 正液噴泉',
        latLng: { lat: 50.1104364, lng: 8.682155 }
    },
    {
        title: 'The Hauptwache 衛戊大本營(餐廳聚集點)',
        latLng: { lat: 50.1134865, lng: 8.6787432 }
    },
    {
        title: 'MyZeil - Shopping Mall',
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

function toggleMarker(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
    }, 1200);
};

function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>Name: ' + marker.title + ' </div>' +
            '<div>Lat: ' + marker.getPosition().lat() + '</div>' +
            '<div>Lng: ' + marker.getPosition().lng() + ' </div>');
        infowindow.open(map, marker);
        infowindow.addListener('closeclick', function() {
            infowindow.setMarker(null);
        });
    }
    toggleMarker(marker);
}

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

        markers.push(marker);

        marker.addListener('click', function() {
            populateInfoWindow(this, infowindow);
        });

        markers[i].setMap(self.googleMap);
    }

    this.currentPlace = ko.observable(this.locationList()[0]);

    this.setPlace = function(clickedPlace) {

        self.currentPlace(clickedPlace);

        for (var i = 0; i < markers.length; i++) {
            if (markers[i].title === self.currentPlace().title()) {
                toggleMarker(markers[i]);
                populateInfoWindow(markers[i], infowindow);
            }
        }
    };

    self.userInput = ko.observable('');

    self.filterMarkers = function() {
        if(infowindow) {
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
        };
    };
}

var my_position = { lat: 50.110924, lng: 8.682127 };

function createMap() {
    return new google.maps.Map(document.getElementById('map'), {
        center: my_position,
        zoom: 14
    });
}

google.maps.event.addDomListener(window, 'load', function() {
    var googleMap = createMap();
    ko.applyBindings(new koViewModel(googleMap));
});