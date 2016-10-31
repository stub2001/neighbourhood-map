//ViewModel

function ViewModel() {
    var self = this;
    self.list = ko.observableArray(dataArray);
    self.currentFilter = ko.observable();
    self.locationSelect = function(loc) {
        google.maps.event.trigger(markers()[loc.id], 'click');
    };


    self.filterProducts = ko.computed(function() {

        if (!self.currentFilter()) {
            //console.log('nofilter');
            return markers();
        } else {
            return ko.utils.arrayFilter(markers(), function(prod) {
                return prod.genre == self.currentFilter();
            });
        }
    });


    self.filter = function(genre) {

        self.currentFilter(genre);
        //clears the markers on the map
        setMapOnAll(null);
        //updates the markers in the array to match the filter choice
        //(this automatically refreshes the list as it's an observable)
        markers(self.filterProducts());
        //reloads the markers on map based on new array
        setMapOnAll(map);

    }

    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
        for (var i = 0; i < markers().length; i++) {
            markers()[i].setMap(map);
        }
    }

    self.unfilter = function() {
        markers.removeAll();
        setMapOnAll(null);
        getAllMarkers()
        setMapOnAll(map);
    }
}


// Activates knockout.js
ko.applyBindings(new ViewModel());