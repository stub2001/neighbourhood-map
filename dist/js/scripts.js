var dataArray = [{
    title: 'Park Ave Penthouse',
    location: {
        lat: 40.7713024,
        lng: -73.9632393
    },
    genre: 'filter 1'
}, {
    title: 'Chelsea Loft',
    location: {
        lat: 40.7444883,
        lng: -73.9949465
    },
    genre: 'filter 0'
}, {
    title: 'Union Square Open Floor Plan',
    location: {
        lat: 40.7347062,
        lng: -73.9895759
    },
    genre: 'filter 1'
}, {
    title: 'East Village Hip Studio',
    location: {
        lat: 40.7281777,
        lng: -73.984377
    },
    genre: 'filter 0'
}, {
    title: 'TriBeCa Artsy Bachelor Pad',
    location: {
        lat: 40.7195264,
        lng: -74.0089934
    },
    genre: 'filter 1'
}, {
    title: 'Chinatown Homey Space',
    location: {
        lat: 40.7180628,
        lng: -73.9961237
    },
    genre: 'filter 0'
}];
function googleError() {
    alert('cannot load Google Map');
}
// Create a map variable
var map;
// Create a new blank array for all the listing markers.
var markers = ko.observableArray();
// Create global var for infowindow
var infowindow;

initMap = function() {

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.7413549,
            lng: -73.9980244
        },
        zoom: 13
    });
    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.
    //var largeInfowindow = new google.maps.InfoWindow();

    var bounds = new google.maps.LatLngBounds();
    getAllMarkers(dataArray);
    loadMarkers();
};
// This function will loop through the markers array and display them all.
function loadMarkers() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    markers().forEach(function(marker) {
        marker.setMap(map);
        bounds.extend(marker.position);
    });
    map.fitBounds(bounds);
}

// The following group uses the location array to create an array of markers on initialize.
function getAllMarkers(locations) {
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        var genre = locations[i].genre;
        var content = locations[i].ajaxContent = ko.observable('pending search...');
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            genre: genre,
            ajaxContent: content,
            animation: google.maps.Animation.DROP,
            id: i
        });

        infowindow = new google.maps.InfoWindow();

        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            var marker = this;
            populateInfoWindow(marker, infowindow);
            toggleBounce(marker);

        });

    }
}
// console.log(markers());

function populateInfoWindow(marker, infowindow) {
    //if marker.ajaxContent is set to the standard value, init the ajax call to go and update the infowindow content
    //once ajax.content is set, just show the already existing content, no need to go and get ajax content again
    if (marker.ajaxContent() === "pending search...") {
        infowindow.setContent(marker.ajaxContent());
        infowindow.open(map, marker);
        // BEGIN FOURSQUARE AJAX INIT
        var url = "https://api.foursquare.com/v2/venues/explore";
        //foursquare client ID
        var idFSq = 'CAD3EEXMNHQFJ4HD215D4EA0KB10WHQGXSRQCV2LFOGFSFCF';
        //foursquare client Secret
        var secretFsq = 'WN4UXNSSMR25SNOMT5VCEBWVVONFQ4HUBGQZZ3DLDI1T5O5F';
        //console.log(marker.position);
        //if statement  - if infor has already been retrieved, do ajax call, otherwise open the already existing infowindow.
        $.ajax({
            url: url,
            dataType: 'json',
            data: "limit=1&ll=" + marker.position.lat() + "," + marker.position.lng() + "&query=" + marker.title + "&" + "client_id=" + idFSq +
                "&client_secret=" + secretFsq + "&v=20161106&m=foursquare",
            method: 'GET',
            async: true,
        }).done(function(result) {

            // TODO: callback function if succes - Will add the rating received from foursquare to the content of the info window
            marker.rating = result.response.groups[0].items[0].venue.rating;

            if (!marker.rating) {
                marker.rating = 'No rating in foursquare';
            }

            var content = '<br><div class="labels">' + '<div class="title">' + marker.title +
                '</div><div class="rating">Foursquare rating: ' + marker.rating + '</div>' + '</div>';
            marker.ajaxContent(content);
            infowindow.setContent(marker.ajaxContent());

        }).fail(function(err) {

            //infowindow.setContent(marker.ajaxContent("Could not load data from foursquare!"));
            alert("Could not load data from foursquare!");
        });

        // END FOURSQUARE AJAX

    } else {
        infowindow.setContent(marker.ajaxContent());
        infowindow.open(map, marker);
    }

}


// Set animation 
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 700);
    }
}
//ViewModel

function ViewModel() {
    var self = this;

    self.list = ko.observableArray(dataArray);
    self.currentFilter = ko.observable();
    self.filters = ko.observableArray(['filter 0', 'filter 1']);
    self.filter = ko.observable('');

    self.locationSelect = function(loc) {
        google.maps.event.trigger(loc, 'click');
    };


    self.filteredItems = ko.computed(function() {
        var filter = self.filter();
        if (!filter || filter === 'filter 0') {

            // SHOW ALL MARKERS WHEN FILTER RESETS
            markers().forEach(function(marker) {
                marker.setVisible(true);
            });
            return markers();

        } else {
            return ko.utils.arrayFilter(markers(), function(i) {
                // CREATE MATCH VARIABLE TO USE TO SET MARKER VISIBILITY
                var match = i.genre == filter;
                i.setVisible(match);
                //close any open infowindows
                if (infowindow) {
                    infowindow.close();
                }
                return match;

            });
        }
    });


}

// Activates knockout.js
ko.applyBindings(new ViewModel());