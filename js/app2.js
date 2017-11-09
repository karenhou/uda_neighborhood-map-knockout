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

var koViewModel = function(map) {
    var self = this;

    self.googleMap = map;

    this.locationList = ko.observableArray([]);

    init_locations.forEach(function(place) {
        self.locationList.push(new Locations(place));
    });

    this.currentPlace = ko.observable(this.locationList()[0]);

    this.setPlace = function(clickedPlace) {
        self.currentPlace(clickedPlace);
    };

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
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent('<div>Name: ' + marker.title + ' </div>' +
                    '<div>Lat:' + marker.position.lat() + '</div>' +
                    '<div>Lng:' + marker.position.lng() + '</div>');
                infowindow.open(map, marker);
            }
        })(marker, i));

        markers[i].setMap(self.googleMap);
    }

    self.userInput = ko.observable('');

    self.filterMarkers = function() {
        var queryMarker = [];
        var searchInput = self.userInput().toLowerCase();

        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
            if (markers[i].title.toLowerCase().indexOf(searchInput) !== -1) {
                queryMarker.push(markers[i]);
            }
        }
        for (var i = 0; i < queryMarker.length; i++) {
            queryMarker[i].setMap(self.googleMap);
        }

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